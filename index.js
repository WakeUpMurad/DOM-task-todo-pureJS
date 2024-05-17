document.addEventListener('DOMContentLoaded', function () {
  runApp()
})

const runApp = () => {
  const tasksData = [
    {
      lastName: 'Казанцев',
      name: 'Геннадий',
      task: 'Структуры данных',
      status: 'выполнено',
    },
    {
      lastName: 'Гахраманов',
      name: 'Мурад',
      task: 'Алгоритмы',
      status: 'не выполнено',
    },
    {
      lastName: 'Ivanov',
      name: 'Ivan',
      task: 'Архитектура',
      status: 'выполнено',
    },
  ]

  const root = document.getElementById('root')

  function makeNewTr({ lastName, name, task, status }) {
    const tr = document.createElement('tr')
    tr.addEventListener('mouseenter', (event) => {
      event.target.classList.add('hoverTR')
    })
    tr.addEventListener('mouseleave', (event) => {
      event.target.classList.remove('hoverTR')
    })
    const th = document.createElement('th')
    th.setAttribute('scope', 'row')
    th.textContent = lastName
    tr.insertAdjacentElement('beforeend', th)
    const tdName = document.createElement('td')
    tdName.textContent = name
    const tdTask = document.createElement('td')
    tdTask.textContent = task
    const tdStatus = document.createElement('td')
    tdStatus.textContent = status
    tr.insertAdjacentElement('beforeend', tdName)
    tr.insertAdjacentElement('beforeend', tdTask)
    tr.insertAdjacentElement('beforeend', tdStatus)
    return tr
  }
  function addNewTr(tr, table) {
    const filterButton = document.getElementById('filterBtn')
    const newTr = makeNewTr(tr)
    newTr.addEventListener('click', (event) => {
      const parentElement = event.target.parentElement
      if (parentElement.classList.contains('taskDone')) {
        parentElement.classList.remove('taskDone')
      } else {
        parentElement.classList.add('taskDone')
        if (filterButton.dataset.filtered === 'true') {
          parentElement.setAttribute('style', 'display: none')
        }
      }
      const doneTasks = document.querySelectorAll('.taskDone')
      if (doneTasks.length) {
        filterButton.removeAttribute('disabled')
      } else {
        filterButton.setAttribute('disabled', 'true')
      }
    })
    newTr.addEventListener('dblclick', (event) => {
      const parentElement = event.target.parentElement
      parentElement.remove()
    })
    document.querySelectorAll('td').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        console.log(event.target)
      })
    })
    document.querySelectorAll('td').forEach((elem) => {
      elem.addEventListener('dblclick', (event) => {
        console.log(event.target)
      })
    })
    table.insertAdjacentElement('beforeend', newTr)
  }

  const renderTitle = () => {
    const title = document.createElement('h1')
    title.innerText = 'DOM lesson'
    root.insertAdjacentElement('afterbegin', title)
  }

  const renderForm = () => {
    const formWrapper = document.createElement('div')
    formWrapper.classList.add('form-container')

    const form = document.createElement('form')
    form.classList.add('form')

    const makeFormLabel = (labelName) => {
      const label = document.createElement('label')
      const labelTitle = document.createElement('h3')
      labelTitle.textContent = labelName[0].toUpperCase() + labelName.slice(1)
      const input = document.createElement('input')
      input.setAttribute('type', 'text')
      input.setAttribute('name', labelName)
      input.setAttribute('placeholder', `Enter your ${labelName}`)
      label.insertAdjacentElement('beforeend', labelTitle)
      label.insertAdjacentElement('beforeend', input)
      return label
    }

    const lastName = makeFormLabel('last name')
    const name = makeFormLabel('name')
    const task = makeFormLabel('task')
    const status = makeFormLabel('status')
    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.textContent = 'Submit'

    form.insertAdjacentElement('beforeend', lastName)
    form.insertAdjacentElement('beforeend', name)
    form.insertAdjacentElement('beforeend', task)
    form.insertAdjacentElement('beforeend', status)
    form.insertAdjacentElement('beforeend', button)

    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)

      const name = formData.get('name')
      const lastName = formData.get('last name')
      const task = formData.get('task')
      const status = formData.get('status')

      const formObject = {
        name: name,
        'last name': lastName,
        task: task,
        status: status,
      }

      let hasError = false

      for (const key in formObject) {
        if (!formObject[key]) {
          form[key].classList.add('errorInput')
          hasError = true
        } else {
          form[key].classList.remove('errorInput')
        }
      }

      if (hasError) {
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('errorMessage')
        errorMessage.setAttribute('id', 'form-error')
        errorMessage.textContent = 'Не удалось добавить запись'
        if (document.getElementById('form-error')) {
          return
        }
        return form.insertAdjacentElement('beforeend', errorMessage)
      }

      const newTask = {
        lastName,
        name,
        task,
        status,
      }
      const table = document.querySelector('.table')
      addNewTr(newTask, table)
      tasksData.push(newTask)
      document.getElementById('form-error') ? document.getElementById('form-error').remove() : ''
      form.reset()
    })

    formWrapper.insertAdjacentElement('afterbegin', form)
    root.insertAdjacentElement('beforeend', formWrapper)
  }

  const renderFilterButton = () => {
    const filterButton = document.createElement('button')
    filterButton.textContent = 'Отфильтровать выполненные задания'
    filterButton.classList.add('filterBtn')
    filterButton.setAttribute('id', 'filterBtn')
    filterButton.setAttribute('disabled', 'true')

    filterButton.addEventListener('click', (event) => {
      const doneTasks = document.querySelectorAll('.taskDone')
      if (event.target.dataset.filtered === 'true') {
        event.target.dataset.filtered = false
        event.target.textContent = 'Отфильтровать выполненные задания'
        doneTasks.forEach((elem) => {
          elem.setAttribute('style', 'display: table-row')
        })
      } else {
        event.target.dataset.filtered = true
        event.target.textContent = 'Показать отфильтрованные задания'
        doneTasks.forEach((elem) => {
          elem.setAttribute('style', 'display: none')
        })
      }
    })

    const filterButtonWrapper = document.createElement('div')
    filterButtonWrapper.insertAdjacentElement('beforeend', filterButton)
    filterButtonWrapper.classList.add('filterBtn-container')
    root.insertAdjacentElement('beforeend', filterButtonWrapper)
  }

  const renderTable = (tasks) => {
    const tableWrapper = document.createElement('div')
    tableWrapper.classList.add('table-container')
    const table = document.createElement('table')
    table.classList.add('table')

    const tableHeadNames = ['Фамилия', 'Имя', 'Тема задания', 'Статус']

    const tr = document.createElement('tr')

    tableHeadNames.forEach((elem) => {
      const th = document.createElement('th')
      th.setAttribute('scope', 'col')
      th.textContent = elem
      tr.insertAdjacentElement('beforeend', th)
    })
    table.insertAdjacentElement('beforeend', tr)

    tasks.forEach((elem) => {
      addNewTr(elem, table)
    })
    tableWrapper.insertAdjacentElement('afterbegin', table)
    root.insertAdjacentElement('beforeend', tableWrapper)
  }

  const initializeApp = () => {
    renderTitle()
    renderForm()
    renderFilterButton()
    renderTable(tasksData)
  }
  initializeApp()
  // Пишите код здесь
}
