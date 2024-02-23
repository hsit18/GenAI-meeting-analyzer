import { MeetingUpload } from "@/components/MeetingUpload";
import { init } from "@/utils/cacheUtil";

const MeetingUploadPage = async () => {
    init();
    return (
        <MeetingUpload />
    )
}

export default MeetingUploadPage;