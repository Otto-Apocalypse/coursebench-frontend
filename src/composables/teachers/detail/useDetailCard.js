import { inject, reactive } from "@vue/composition-api"

export default () => {

  const teacherDetail = inject("teacherDetail")

  const statics = {
    
  }

  const status = reactive({

  })

  return { teacherDetail, statics, status }
}