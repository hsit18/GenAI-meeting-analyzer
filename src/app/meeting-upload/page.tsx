import { MeetingUpload } from "@/components/MeetingUpload";
import { init } from "@/utils/cacheUtil";
import { getImages } from "@/utils/chatGPT";

const MeetingUploadPage = async () => {
    //await getImages();
    init();
    return (
        <MeetingUpload />
    )
}

export default MeetingUploadPage;