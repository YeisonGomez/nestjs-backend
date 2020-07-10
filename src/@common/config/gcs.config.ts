import { registerAs } from "@nestjs/config";

export default registerAs('gcs', () => ({
  bucket: process.env.GCS_BUCKET
}))