const app = new Vue({
  el: '#app',
  data: {
    list: JSON.parse(localStorage.getItem('list')) || [],
    todo: '',
    editTodo: '', //編輯的資料,
    beforeTitle: '', //當前修改的事項
    visibility: 'all', //篩選事件完成的狀態
  },
  methods: {
    addTodo() {
      const vm = this
      if (vm.todo == '') {
        return
      }
      vm.list.push({
        title: vm.todo,
        isComplete: false,
      })

      localStorage.setItem('list', JSON.stringify(vm.list))
      vm.todo = ''
    },
    deleteTodo(item) {
      const vm = this
      let target = vm.list.indexOf(item)
      vm.list.splice(target, 1)
      localStorage.setItem('list', JSON.stringify(vm.list))
    },
    edit(item) {
      const vm = this
      vm.beforeTitle = item.title
      vm.editTodo = item
    },
    editFinish() {
      const vm = this
      localStorage.setItem('list', JSON.stringify(vm.list))
      vm.editTodo = ''
      //清空
    },
    cancelEdit(item) {
      const vm = this
      item.title = vm.beforeTitle
      vm.beforeTitle = ''
      vm.editTodo = ''
    },

    getTimeRemaining(endtime) {
      const total = Date.parse(endtime) - Date.parse(new Date())
      const seconds = Math.floor((total / 1000) % 60)
      const minutes = Math.floor((total / 1000 / 60) % 60)
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
      const days = Math.floor(total / (1000 * 60 * 60 * 24))
      return { total, days, hours, minutes, seconds }
    },
    initializeClock(id, endtime) {
      const clock = document.getElementById(id)
      const daysSpan = clock.querySelector('.days')
      const hoursSpan = clock.querySelector('.hours')
      const minutesSpan = clock.querySelector('.minutes')
      const secondsSpan = clock.querySelector('.seconds')
      function updateClock() {
        const t = getTimeRemaining(endtime)
        daysSpan.innerHTML = t.days
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2)
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2)
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2)
        if (t.total <= 0) {
          clearInterval(timeinterval)
        }
      }
      updateClock()
      const timeinterval = setInterval(updateClock, 1000)
    },
    //參考了網路上計時器的做法抓取時間，但是具體將功能渲染到畫面上配合vue還需要時間思考
    setTime() {
      const deadline = new Date(
        Date.parse(new Date()) + 1 * 24 * 60 * 60 * 1000
      )
      initializeClock('clockdiv', deadline)
    },
  },

  computed: {
    filterList() {
      const vm = this
      if (vm.visibility === 'all') {
        return vm.list
      } else if (vm.visibility === 'unCompleted') {
        return vm.list.filter((item) => {
          return !item.isComplete
        })
      } else if (vm.visibility === 'completed') {
        return vm.list.filter((item) => {
          return item.isComplete
        })
      }
    },
  },
  created() {
    this.setTime()
  },
})

//
