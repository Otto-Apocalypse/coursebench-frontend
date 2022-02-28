import { inject, watch } from "@vue/composition-api"

export default () => {

  const sortFunc = (x, y) => {
    let xTime = new Date(status.sortKey === "发布时间" ? x.post_time : x.update_time)
    let yTime = new Date(status.sortKey === "发布时间" ? y.post_time : y.update_time)
    let f = status.order === "从后往前" ? 1 : -1
    if (xTime === yTime) { return 0; }
    else if (xTime < yTime) { return f; }
    else { return -f; }
  }

  const commentText = inject("commentText")

  const statics = {
    sortKeyItem: ['发布时间', '修改时间'],
    orderItem: ['从后往前', '从前往后'],
  }

  const status = inject("commentStatus")

  watch(status, (oldValue, newValue) => {
    if (oldValue.sortKey == newValue.sortKey && oldValue.order == oldValue.order) {
      return;
    } commentText.sort(sortFunc)
  })

  commentText.sort(sortFunc)

  return { statics, status }
}