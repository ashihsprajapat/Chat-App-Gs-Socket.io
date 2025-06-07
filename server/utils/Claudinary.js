
import { v2 as cloudinary } from 'cloudinary'

    cloudinary.config({
        cloud_name: process.env.API_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.skVBqIRQNEpl5Vi2MWRlrpERZIE
    });

    export default cloudinary
