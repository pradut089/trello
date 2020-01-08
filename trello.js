const apiKey = 'your apiKey';
const token = 'your token';
const boardId = 'your board id';
const url = `https://api.trello.com/1/boards/${boardId}/lists?cards=all&key=${apiKey}&token=${token}`;

getListAndCards();
async function getListAndCards() {
    let listsAndCards = await fetch(url).then(res => res.json()).then(data => data);
    // console.log(listsAndCards);
    createLists(listsAndCards)
}

function createLists(listsAndCards) {
    console.log(listsAndCards);

    let divLists = document.getElementById('lists')
    while (divLists.hasChildNodes()) {
        divLists.removeChild(divLists.firstChild);
    }
    for (listName of listsAndCards) {
        // console.log(lists[i]["name"]);
        const text = document.createTextNode(listName.name);
        const list = document.createElement('div');
        list.className = 'list'
        list.setAttribute('listId', listName.id);
        // console.log(list.getAttribute('listId'));
        const area = document.createElement('div');
        area.append(text);
        
        list.append(area);
        const cards = document.createElement('div');
        cards.className = 'cards';
        for (card of listName.cards) {
            // console.log(cards.getAttribute('cardId'));
            cardName = document.createTextNode(card.name);
            const cardsName = document.createElement('div');
            cardsName.append(cardName);
            cardsName.className = 'cardsName'
            cardsName.setAttribute('cardId', card.id);
            const del = document.createElement('button');
            del.append('D');
            const edit = document.createElement('button');
            edit.append('E');
            del.className = 'del';
            edit.className = 'edit';
            cardsName.append(del);
            cardsName.append(edit);
            cards.append(cardsName);
            list.append(cards);
            edit.addEventListener('click', editCard);
            del.addEventListener('click', deleteCard);
            cardsName.addEventListener('click', openCard);
        }
        const addCard = document.createElement('button');
        addCard.className = 'addCard';
        addCard.append('+ Add another card');
        list.append(addCard)
        divLists.append(list)
        addCard.addEventListener('click', changeToInput)
    }
    const addCard = document.createElement('button');
    addCard.className = 'addCard';
    addCard.append('+ Add another list');
    const list = document.createElement('div');
    list.className = 'addList'
    list.append(addCard);
    divLists.append(list);
    addCard.addEventListener('click', addList);
}

function changeToInput(e) {
    // console.log(e.srcElement.parentElement);
    e.srcElement.style = 'display:none';
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');
    input.addEventListener('focusout', getListAndCards)
    input.focus();
    input.select();
    form.append(input);
    button.append('submit');
    form.append(button);
    form.addEventListener('submit', addAnotherCard);
    list = e.srcElement.parentElement;
    list.append(form);
}

async function addAnotherCard(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.srcElement.parentElement);
    list = e.srcElement.parentElement;
    listId = list.getAttribute('listId');
    console.log(e.srcElement.firstChild.value);
    input = e.srcElement.firstChild.value;
    if (input) {
        const Url = `https://api.trello.com/1/cards?idList=${listId}&name=${input}&key=${apiKey}&token=${token}`;
        const resp = await fetch(Url, { method: 'POST' });
        if (resp.ok) {
            getListAndCards();
        }
    }
}

async function editCard(e) {
    e.preventDefault();
    // e.stopPropagation();
    // console.log(e.srcElement.parentElement.parentElement.getAttribute('cardId'));
    // console.log(e.srcElement.previousSibling);
    const cardName = e.srcElement.parentElement;
    console.log(cardName);
    // const card = e.srcElement.parentElement.parentElement;
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.addEventListener('focusout', getListAndCards)
    form.append(input);
    cardName.append(form);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.srcElement.parentElement.getAttribute('cardId'));
        console.log(e.srcElement.parentElement.parentElement);
        const input = e.srcElement.firstChild.value;
        console.log(input);
        cardId = e.srcElement.parentElement.getAttribute('cardId');
        if (input) {
            const Url = `https://api.trello.com/1/cards/${cardId}?name=${input}&key=${apiKey}&token=${token}`;
            const resp = await fetch(Url, { method: 'PUT' });
            if (resp.ok) {
                getListAndCards();
            }
        }
    })
}

async function deleteCard(e) {
    e.preventDefault();
    e.stopPropagation();
    const cardId = e.srcElement.parentElement.getAttribute('cardId');
    console.log(cardId);
    const deleteCardUrl = `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${token}`;
    const resp = await fetch(deleteCardUrl, { method: 'DELETE' });
    if (resp.ok) {
        getListAndCards();
    }
}

function editListHeader(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.srcElement.parentElement);
    console.log(e.srcElement.parentElement.parentElement)
    listId = e.srcElement.parentElement.parentElement.getAttribute('listId');
    e.srcElement.style = 'display:none';
    const form = document.createElement('form')
    const input = document.createElement('input');
    input.addEventListener('focusout', getListAndCards)
    form.append(input)
    input.type = 'text';
    e.srcElement.parentElement.append(form);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        // console.log(e.srcElement.parentElement.parentElement.getAttribute('cardId'));
        const input = e.srcElement.firstChild.value;
        console.log(input);
        // cardId = e.srcElement.parentElement.parentElement.getAttribute('cardId');
        if (input) {
            const Url = `https://api.trello.com/1/lists/${listId}?name=${input}&key=${apiKey}&token=${token}`;
            const resp = await fetch(Url, { method: 'PUT' });
            if (resp.ok) {
                getListAndCards();
            }
        }
    })
}

function addList(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.srcElement);
    // console.log(e.srcElement.parentElement);
    e.srcElement.style = 'display:none';
    const form = document.createElement('form')
    const input = document.createElement('input');
    input.type = 'text';
    input.addEventListener('focusout', getListAndCards)
    form.append(input)
    input.type = 'text';
    // input.style = 'background-color: #fff';
    input.style = 'width: 90%';
    e.srcElement.parentElement.append(form);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.srcElement.parentElement);
        console.log(e.srcElement.firstChild.value);
        const input = e.srcElement.firstChild.value;
        if (input) {
            const Url = `https://api.trello.com/1/lists?name=${input}&idBoard=${boardId}&pos=bottom&key=${apiKey}&token=${token}`;
            const resp = await fetch(Url, { method: 'POST' });
            if (resp.ok) {
                getListAndCards();
            }
        }
    })
}

async function openCard(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log('event', event); 
    if (e.target.className === 'cardsName') {
        // console.log('inside opencard if')
        if (e.target.classList.contains('edit')) {
            console.log('edit')
        }
        else {
            const popUp = document.createElement('div')
            popUp.className = 'modal';
            // popUp.style.display = 'block';
            popUp.id = 'popUP';
            console.log(popUp);
            cardId = e.srcElement.getAttribute('cardId');
            e.srcElement.append(popUp);
            createPopUp(cardId);
        }
    }
}
async function createPopUp(cardId) {
    const popUp = document.getElementById('popUP')
    // console.log(popUp);
    const cardUrl = `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${token}`;
    const checkListUrl = `https://api.trello.com/1/cards/${cardId}/checklists?checkItems=all&checkItem_fields=all&filter=all&fields=all&key=${apiKey}&token=${token}`;
    let cards = await fetch(cardUrl).then(res => res.json()).then(data => data);
    // console.log(cards);
    let checkList = await fetch(checkListUrl).then(res => res.json()).then(data => data);
    // console.log(checkList);
    while (popUp.hasChildNodes()) {
        popUp.removeChild(popUp.firstChild);
    }

    window.onclick = function (event) {
        console.log(event);
        if (event.target != popUp) {
            getListAndCards();
        }
    }

    // popUp.append(closeBtn);
    // console.log(cardId)
    // console.log(cards);
    // console.log(checkList);
    const cardName = document.createElement('div')
    cardName.append(cards.name);
    console.log(cardName);
    popUp.append(cardName);

    const checkListBox = document.createElement('div');
    for (let list of checkList) {
        const checkListHeader = document.createElement('div');
        checkListHeader.className = 'checkListHeader'
        checkListHeader.append(list.name)
        checkListHeader.contentEditable = 'true';
        checkListBox.append(checkListHeader);
        checkListBox.className = 'checkListBox';
        for (checks of list.checkItems) {
            console.log(checks);
            console.log(checks.id);

            const checksName = document.createElement('div');
            const checkBox = document.createElement('input');
            checkBox.setAttribute('state', checks.state);
            checkBox.addEventListener('click', checked);

            checkBox.type = 'checkBox';
            if (checks.state === 'complete') {
                checkBox.checked = 'true';
            }

            const name = document.createElement('div')
            name.append(checks.name)
            checksName.append(checkBox);
            checksName.append(name)
            checksName.className = 'checksName';
            checksName.setAttribute('cid',checks.id);
            checkListBox.append(checksName)
            if (checkBox.checked) {
                name.style.setProperty('text-decoration', 'line-through');
            }
        }
        for (card of cards.idChecklists) {
            checkListBox.setAttribute('checkListId', card);
        }
        const addItem = document.createElement('button')
        addItem.append('Add Item')
        addItem.addEventListener('click', addNewItem);
        const deleteCheckList = document.createElement('button')
        deleteCheckList.append('delete checklist');
        deleteCheckList.addEventListener('click', deleteChecklist)
        checkListBox.append(addItem)
        checkListBox.append(deleteCheckList);
        popUp.append(checkListBox);
    }
    const addCheckList = document.createElement('button')
    addCheckList.append('Add Checklist');
    popUp.append(addCheckList);
    addCheckList.addEventListener('click', addNewCheckList);

}

async function checked(e){
    // console.log(e.srcElement.getAttribute('state'));
    let check = e.srcElement.getAttribute('state');
    let checklistId = e.srcElement.parentElement.getAttribute('cid');
    let card_Id = e.srcElement.parentElement.parentElement.parentElement.parentElement.getAttribute('cardid');
    // console.log(card_Id);
    // console.log(checklistId);
    if(check == 'complete'){
        const url = `https://api.trello.com/1/cards/${card_Id}/checkItem/${checklistId}?state=incomplete&key=${apiKey}&token=${token}`;
        await fetch(url, {
            method: 'PUT'
        }).then(res => {
            if (res.ok) {
                createPopUp(card_Id)
            } else {
                console.log('error');
            }
        })
        
    }else{
        const url = `https://api.trello.com/1/cards/${card_Id}/checkItem/${checklistId}?state=complete&key=${apiKey}&token=${token}`;
        await fetch(url, {
            method: 'PUT'
        }).then(res => {
            if (res.ok) {
                createPopUp(card_Id)
            } else {
                console.log('error');
            }
        })
        
    }
}



async function addNewCheckList(e) {
    e.preventDefault();
    // console.log(e.srcElement);
    // console.log(e.srcElement.parentElement.parentElement.getAttribute('cardId'));
    const cardId = e.srcElement.parentElement.parentElement.getAttribute('cardId');
    console.log(cardId);
    e.srcElement.style = 'display:none';
    const form = document.createElement('form');
    const input = document.createElement('input');
    form.append(input)
    e.srcElement.parentElement.append(form);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const text = input.value
        if (text) {
            const url = `https://api.trello.com/1/checklists?idCard=${cardId}&name=${text}&key=${apiKey}&token=${token}`;
            const resp = await fetch(url, { method: 'POST' });
            if (resp.ok) {
                createPopUp(cardId);
            }
        }
    })
}

async function deleteChecklist(e) {
    console.log(e.srcElement.parentElement.getAttribute('checklistid'));
    const checkListId = e.srcElement.parentElement.getAttribute('checklistid');
    const cardId = e.srcElement.parentElement.parentElement.parentElement.getAttribute('cardId');
    const deleteChecklistUrl = `https://api.trello.com/1/checklists/${checkListId}?key=${apiKey}&token=${token}`;

    const resp = await fetch(deleteChecklistUrl, { method: 'DELETE' });
    if (resp.ok) {
        createPopUp(cardId);
    }
}

function addNewItem(e) {
    e.preventDefault();
    // console.log(e.srcElement);
    // console.log(e.srcElement.parentElement.getAttribute('checklistid'));
    const checkListId = e.srcElement.parentElement.getAttribute('checklistid');
    // console.log(checkListId);
    const cardId = e.srcElement.parentElement.parentElement.parentElement.getAttribute('cardId');
    console.log(cardId)
    e.srcElement.style = 'display:none';
    const form = document.createElement('form');
    const input = document.createElement('input');
    form.append(input)
    e.srcElement.parentElement.append(form);
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const text = input.value;
        if (text) {
            const url = `https://api.trello.com/1/checklists/${checkListId}/checkItems?name=${text}&pos=bottom&checked=false&key=${apiKey}&token=${token}`;
            const resp = await fetch(url, { method: 'POST' });
            if (resp.ok) {
                createPopUp(cardId);
            }
        }
    })
}