import { YoutubeTranscript } from 'youtube-transcript';

function hasYouTubeUrl(url: string) {
        return url.includes('youtube.com') || url.includes('youtu.be');
}

async function getTranscript(videoUrl: string) {
    return await YoutubeTranscript.fetchTranscript(videoUrl);
}

export { hasYouTubeUrl, getTranscript };