document.addEventListener('DOMContentLoaded', function () {
  runApp()
})

const tasksData = [
  {
    lastName: 'Казанцев',
    name: 'Геннадий',
    task: 'Структуры данных',
    status: 'Выполнено',
  },
  {
    lastName: 'Гахраманов',
    name: 'Мурад',
    task: 'Алгоритмы',
    status: 'Не выполнено',
  },
  {
    lastName: 'Иванов',
    name: 'Иван',
    task: 'Архитектура',
    status: 'Выполнено',
  },
]
const tableHeadNames = ['Фамилия', 'Имя', 'Тема задания', 'Статус']

const formlabelNames = ['last name', 'name', 'task', 'status']

const filterBtnText = 'Отфильтровать выполненные задания'
const otherFilterBtnText = 'Показать отфильтрованные задания'

const root = document.getElementById('root')

const runApp = () => {
  const createSelect = () => {
    const select = document.createElement('select')
    const defaultOption = document.createElement('option')
    const optionOne = document.createElement('option')
    const optionTwo = document.createElement('option')
    defaultOption.innerText = 'Укажите статус'
    defaultOption.setAttribute('selected', true)
    defaultOption.setAttribute('hidden', true)
    defaultOption.setAttribute('disabled', true)
    select.insertAdjacentElement('beforeend', defaultOption)
    optionOne.innerText = 'Не выполнено'
    select.insertAdjacentElement('beforeend', optionOne)
    optionTwo.innerText = 'Выполнено'
    select.insertAdjacentElement('beforeend', optionTwo)
    return select
  }
  const createInput = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    return input
  }
  const handleClickTableRow = (event) => {
    const parentElement = event.target.parentElement
    parentElement.childNodes.forEach((elem, index) => {
      if (index === parentElement.childNodes.length - 1) {
        const select = createSelect()
        select.onclick = (event) => event.stopPropagation()
        select.ondblclick = (event) => event.stopPropagation()
        select.onchange = (event) => {
          parentElement.childNodes.forEach((elem) => (elem.textContent = elem.firstChild.value))
          if (event.target.value === 'Выполнено') {
            parentElement.classList.add('taskDone')
          } else if (event.target.value === 'Не выполнено') {
            parentElement.classList.remove('taskDone')
          }
        }
        elem.textContent = ''
        elem.insertAdjacentElement('beforeend', select)
      } else {
        const input = createInput()
        input.onclick = (event) => event.stopPropagation()
        input.ondblclick = (event) => event.stopPropagation()
        input.setAttribute('value', `${elem.innerText}`)
        elem.textContent = ''
        elem.insertAdjacentElement('beforeend', input)
      }
    })
  }
  const handleEnterPress = (event) => {
    const parentElement = event.target.parentElement.parentElement
    if (event.code === 'Enter') {
      parentElement.childNodes.forEach((elem) => (elem.textContent = elem.firstChild.value))
    }
  }
  const handleDblClickTableRow = (event) => {
    const parentElement = event.target.parentElement
    parentElement.remove()
  }

  const addNewTask = (newTask, tableToAdd) => {
    const { lastName, name, task, status } = newTask
    const tableRow = document.createElement('tr')
    const tableHeader = document.createElement('th')
    tableHeader.setAttribute('scope', 'row')
    tableHeader.textContent = lastName
    tableRow.insertAdjacentElement('beforeend', tableHeader)
    const tableDataName = document.createElement('td')
    tableDataName.textContent = name
    const tableDataTask = document.createElement('td')
    tableDataTask.textContent = task
    const tableDataStatus = document.createElement('td')
    if (status === 'Выполнено') {
      tableRow.classList.add('taskDone')
    }
    tableDataStatus.textContent = status
    tableRow.insertAdjacentElement('beforeend', tableDataName)
    tableRow.insertAdjacentElement('beforeend', tableDataTask)
    tableRow.insertAdjacentElement('beforeend', tableDataStatus)
    const tableWithNewRow = tableToAdd.insertAdjacentElement('beforeend', tableRow)
    return tableWithNewRow
  }

  const renderTitle = (rootElement) => {
    const title = document.createElement('h1')
    title.innerText = 'DOM lesson'
    rootElement.insertAdjacentElement('afterbegin', title)
  }

  const renderForm = (rootElement, formlabels) => {
    const formWrapper = document.createElement('div')
    formWrapper.classList.add('form-container')

    const form = document.createElement('form')

    const makeFormlabel = (labelName) => {
      const label = document.createElement('label')
      const labelTitle = document.createElement('h3')
      labelTitle.textContent = labelName[0].toUpperCase() + labelName.slice(1)
      label.insertAdjacentElement('beforeend', labelTitle)
      return label
    }

    const makeFormSelectWithlabel = (selectName) => {
      const select = createSelect()
      select.setAttribute('name', selectName)
      const selectWithlabel = makeFormlabel(selectName)
      selectWithlabel.insertAdjacentElement('beforeend', select)
      return selectWithlabel
    }
    const makeFormInputWithlabel = (inputName) => {
      const inputWithlabel = makeFormlabel(inputName)
      const input = createInput()
      input.setAttribute('placeholder', `Enter your ${inputName}`)
      input.setAttribute('name', inputName)
      inputWithlabel.insertAdjacentElement('beforeend', input)
      return inputWithlabel
    }

    formlabels.forEach((name) => {
      if (name === 'status') {
        form.insertAdjacentElement('beforeend', makeFormSelectWithlabel(name))
      } else {
        form.insertAdjacentElement('beforeend', makeFormInputWithlabel(name))
      }
    })

    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.textContent = 'Добавить'
    form.insertAdjacentElement('beforeend', button)

    const handleFormSubmitData = (event) => {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)

      const formObjectData = formlabels.reduce((acc, name) => {
        return (acc = { ...acc, [name]: formData.get(name) })
      }, {})

      const checkEmptyFormFields = (formData) => {
        let hasEmpty = false
        for (const key in formData) {
          if (!formData[key]) {
            form[key].setAttribute('required', true)
            hasEmpty = true
          } else {
            form[key].removeAttribute('required')
          }
        }
        return hasEmpty
      }

      const formError = document.getElementById('form-error')

      const addErrorMsg = () => {
        const errorMessage = document.createElement('div')
        errorMessage.classList.add('errorMessage')
        errorMessage.setAttribute('id', 'form-error')
        errorMessage.textContent = 'Не удалось добавить запись'
        if (formError) {
          return console.log('form has error')
        }
        return form.insertAdjacentElement('beforeend', errorMessage)
      }
      const pushNewTaskAndResetForm = () => {
        const formatedFormData = {}
        for (const key in formObjectData) {
          if (key.includes(' ')) {
            let formatedKey = key.split(' ').reduce((acc, el, i) => {
              if (i > 0) {
                return acc + el[0].toUpperCase() + el.slice(1)
              }
              return acc + el
            }, '')
            formatedFormData[formatedKey] = formObjectData[key]
          } else {
            formatedFormData[key] = formObjectData[key]
          }
        }
        tasksData.push(formatedFormData)
        filedTable([formatedFormData])
        formError && formError.remove()
        form.reset()
      }

      checkEmptyFormFields(formObjectData) ? addErrorMsg() : pushNewTaskAndResetForm()
    }

    form.addEventListener('submit', (e) => handleFormSubmitData(e))
    formWrapper.insertAdjacentElement('afterbegin', form)
    rootElement.insertAdjacentElement('beforeend', formWrapper)
  }

  const renderFilterButton = (rootElement, buttonText, buttonOtherText) => {
    const filterButton = document.createElement('button')
    filterButton.textContent = buttonText
    filterButton.classList.add('filterBtn')
    filterButton.setAttribute('id', 'filterBtn')

    const handleFilterBtnClick = (event) => {
      const doneTasks = document.querySelectorAll('.taskDone')
      if (event.target.dataset.filtered === 'true') {
        event.target.dataset.filtered = false
        event.target.textContent = buttonText
        doneTasks.forEach((elem) => {
          elem.classList.remove('hiddenTask')
        })
      } else {
        event.target.dataset.filtered = true
        event.target.textContent = buttonOtherText
        doneTasks.forEach((elem) => {
          elem.classList.add('hiddenTask')
        })
      }
    }
    filterButton.onclick = (e) => handleFilterBtnClick(e)

    const filterButtonWrapper = document.createElement('div')
    filterButtonWrapper.insertAdjacentElement('beforeend', filterButton)
    filterButtonWrapper.classList.add('filterBtn-container')
    rootElement.insertAdjacentElement('beforeend', filterButtonWrapper)
  }

  const renderTable = (rootElement, tableHeads) => {
    const tableWrapper = document.createElement('div')
    tableWrapper.classList.add('table-container')
    const taskTable = document.createElement('table')
    taskTable.setAttribute('id', 'table')
    taskTable.onclick = (event) => {
      if (event.target.getAttribute('scope') === 'col') {
        return undefined
      } else {
        handleClickTableRow(event)
      }
    }
    taskTable.ondblclick = (event) => {
      if (event.target.getAttribute('scope') === 'col') {
        return undefined
      } else {
        handleDblClickTableRow(event)
      }
    }
    taskTable.onkeyup = (event) => {
      if (event.code === 'Enter') {
        handleEnterPress(event)
      }
    }

    const thead = document.createElement('thead')
    tableHeads.forEach((headName) => {
      const tablehead = document.createElement('th')
      tablehead.setAttribute('scope', 'col')
      tablehead.textContent = headName
      thead.insertAdjacentElement('beforeend', tablehead)
    })
    taskTable.insertAdjacentElement('beforeend', thead)
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => console.log(mutation.target, mutation.addedNodes))
    })
    observer.observe(taskTable, { childList: true })
    tableWrapper.insertAdjacentElement('afterbegin', taskTable)
    rootElement.insertAdjacentElement('beforeend', tableWrapper)
  }

  const initializeApp = (rootElem) => {
    renderTitle(rootElem)
    renderForm(rootElem, formlabelNames)
    renderFilterButton(rootElem, filterBtnText, otherFilterBtnText)
    renderTable(rootElem, tableHeadNames)
  }
  initializeApp(root)

  const filedTable = (tasts) => {
    const table = document.getElementById('table')
    tasts.forEach((task) => {
      addNewTask(task, table)
    })
  }
  filedTable(tasksData)
}
