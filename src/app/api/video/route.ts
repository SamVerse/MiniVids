import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Types, FilterQuery } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const limit = 3; // number of videos per batch
    const cursor = searchParams.get("cursor"); // last _id

    const query: FilterQuery<IVideo> = {};
    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) }; // get videos older than cursor
    }

    const videos = await Video.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    const nextCursor = videos.length > 0 ? videos[videos.length - 1]._id : null;

    return NextResponse.json({ videos, nextCursor });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.log("Unauthorized request");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body : IVideo = await request.json();

        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json({ error: "Title, description,video URL and thumbnail are required" }, { status: 400 });
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            Transformation: body?.transformations?? {
                width: 1080,
                height: 1920,
                quality: body?.transformations?.quality ?? 100,
            },
        }

        const newVideo = new Video({
            ...videoData,
        });
        await newVideo.save();

        return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        console.error("Error saving video:", error);
        return NextResponse.json({ error: "Failed to save video" }, { status: 500 });
    }
}