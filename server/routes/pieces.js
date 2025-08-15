import express from 'express';
import db from '../db.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    forcePathStyle: true,
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test"
    }
});

const router = express.Router();

// GET route to fetch all pieces, optionally filtered by user ID
router.get("/", async (req, res) => {
    try {
        const { user_id } = req.query;
        let pieces;

        if (user_id) {
            pieces = await db("user_pieces")
                .join("pieces", "user_pieces.piece_id", "pieces.id")
                .where({ user_id })
                .select(
                    "pieces.rarity",
                    "user_pieces.piece_id",
                    "user_pieces.acquired_at",
                    "pieces.name as piece_name",
                    "pieces.description",
                    "pieces.image_url"
                )
                .orderBy("user_pieces.piece_id");
        } else {
            pieces = await db("pieces").select(
                "id as piece_id",
                "name as piece_name",
                "description",
                "rarity",
                "image_url"
            );
        }

        // Generate signed URLs for each piece
        const piecesWithSignedUrls = await Promise.all(
            pieces.map(async (piece) => {
                if (piece.image_url) {
                    try {
                        const signedUrl = await getSignedUrl(
                            s3Client,
                            new GetObjectCommand({
                                Bucket: process.env.S3_BUCKET || "breezechess-bucket",
                                Key: piece.image_url
                            }),
                            { expiresIn: 60 } // 1 minute expiry
                        );

                        let browserFriendlyUrl = signedUrl;
                        if (process.env.NODE_ENV === 'development') {
                            browserFriendlyUrl = signedUrl.replace(
                                "localstack:4566",
                                "localhost:4566"
                            );
                        }

                        return { ...piece, signed_url: browserFriendlyUrl };
                    } catch (err) {
                        console.error(`Failed to generate signed URL for piece ${piece.piece_id}:`, err);
                        return { ...piece, signed_url: null };
                    }
                }
                return { ...piece, signed_url: null };
            })
        );

        return res.status(200).json(piecesWithSignedUrls);
    } catch (error) {
        console.error("Error getting pieces:", error.message);
        return res.status(500).json({ error: `Failed to get pieces: ${error.message}` });
    }
});

// GET route to fetch a piece by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let piece = await db('pieces').where({ id }).first();
        return res.status(200).json(piece);
    } catch (error) {
        console.error('Error getting piece:', error.message);
        return res.status(500).json({ error: `Failed to get piece: ${error.message}` });
    }
});

export default router;
