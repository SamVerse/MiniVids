import mongoose , {Schema, model, models} from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920,
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;  
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformations?: {
        width: number;
        height: number;
        quality?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
        trim: true,
    },
    controls: {
        type: Boolean,
        default: true, // Default to showing controls
    },
    transformations: {
        width: {
            type: Number,
            default: VIDEO_DIMENSIONS.width,
        },
        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height,
        },
        quality: {
            type: Number,
            min: 1,
            max: 100,
        },
    },
}, {
    timestamps: true,
});

//Create a post hook after the document is saved to the database to the user a notification to his email that the video has been uploaded successfully.
videoSchema.post('save', function(doc) {
    // Here you can implement any logic you want to execute after saving the video.
    // For example, sending a notification email to the user.
    console.log(`Video with title "${doc.title}" has been saved successfully.`);
});


const Video = models?.Video || model<IVideo>('Video', videoSchema);
// If the Video model already exists, use it; otherwise, create a new one.

export default Video;