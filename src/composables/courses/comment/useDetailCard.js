import { inject } from "vue"
import { mdiStar, mdiStarOutline } from "@mdi/js";

export default () => {

    const teachers = inject('teachers')
    const statics = {
        icons: {
            mdiStarOutline,
            mdiStar
        }
    }

    return { teachers, statics }
}
