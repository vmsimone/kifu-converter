function loadPage() {
    //do something
    $('button').on('click', () => {
        const input = $('#input').val().trim();
        replaceWords(input);
    })
}

function replaceWords(input) {
    let output = input.replace('Resigns', '投了');
    output = output.replace(/ \[Diagram.*?\]/g, '');
    output = output.replace(/ \(Diagram.*?\)/g, '');
    output = output.replace(' ;', ';')

    replaceCoordinates(output);
}

function replaceCoordinates(input) {
    let output;

    output = input.replace(/a/g, '一');
    output = output.replace(/b/g, '二');
    output = output.replace(/c/g, '三');
    output = output.replace(/d/g, '四');
    output = output.replace(/e/g, '五');
    output = output.replace(/f/g, '六');
    output = output.replace(/g/g, '七');
    output = output.replace(/h/g, '八');
    output = output.replace(/i/g, '九');

    replacePieceNames(output)
}

function replacePieceNames(input) {
    let output = input.replace(/\+P/g, 'と');
    
    output = output.replace(/\T/g, 'と');
    output = output.replace(/\+L/g, '成香');
    output = output.replace(/\+N/g, '成桂');
    output = output.replace(/\+S/g, '成銀');

    output = output.replace(/\+R/g, '龍');
    output = output.replace(/D/g, '龍');
    output = output.replace(/\+B/g, '馬');
    output = output.replace(/H/g, '馬');
    
    output = output.replace(/P/g, '歩');
    output = output.replace(/L/g, '香');
    output = output.replace(/N/g, '桂');
    output = output.replace(/S/g, '銀');
    output = output.replace(/G/g, '金');
    output = output.replace(/K/g, '玉');
    output = output.replace(/R/g, '飛');
    output = output.replace(/B/g, '角');

    console.log(output);

    organizeMoves(output);
}

function organizeMoves(input) {
    let movesArr = input.split(';').join('').split(' ');
    let organizedArr = [];

    movesArr.forEach((move, i) => {
        let prevMove = movesArr[i - 1];
        let player = (i % 2 === 0 ? 'sente' : 'gote')

        let moveIsCapture = move.indexOf('x') > -1;
        let moveIsDrop = move.indexOf('*') > -1;
        let moveIsPawnDrop = move.indexOf('P*') > -1;
        let moveIsAmbiguous = move.length > 5;

        move = move.replace('+', '成');
        move = move.replace('=', '不成');

        if (move === '投了') {
            organizedArr.push(move);

        } else if(moveIsCapture) {
            // if(moveIsAmbiguous) {
            //     move = ambiguityHandler(move, player);
            // }
            move = captureHandler(move, prevMove);
            organizedArr.push(move);
        } else if(moveIsAmbiguous) {
            move = ambiguityHandler(move, player);
            organizedArr.push(move);
        } else {
            if(moveIsDrop && !moveIsPawnDrop) {
                move = move + '打';
            }
            const piece = move[0];
            const coord = move[2] + move[3]
            let newMove = coord + piece + move.substring(4);

            organizedArr.push(newMove);
        }
    });
    console.log(movesArr);

    printKifu(organizedArr);
}

function captureHandler(move, prevMove) {
    if(prevMove == undefined) {
        const piece = move[0];
        const coord = move[2] + move[3]
        let newMove = coord + piece + move.substring(4);
        return newMove;
    } else {
        let sameCoord = (prevMove[2] + prevMove[3]) === (move[2] + move[3])
        if(sameCoord) {
            let newMove = '同' + move[0] + move.substring(4);
            return newMove
        } else {
            const piece = move[0];
            const coord = move[2] + move[3]
            let newMove = coord + piece + move.substring(4);
            return newMove;
        }
    }
}

function ambiguityHandler(move, player) {
    const piece = move[0];
    const originCol = move[1];
    const originRow = kanjiValue(move[2]);
    const destinationCol = move[4];
    const destinationRow = kanjiValue(move[5]);

    let newMove = piece + destinationCol + move[5];

    // it's actually impossible to do this without a board state so.... shrug

    const lateralMove = (originRow === destinationRow || originRow === destinationRow + 1 || originRow === destinationRow - 1);
    const verticalMove = (originCol === destinationCol);

    if(player == 'sente') {
        if(lateralMove) {
            let direction = originCol < destinationCol ? '右' : '左';
            newMove += direction;
        } else if (verticalMove) {
            let direction = originRow > destinationRow ? '直' : '引';
            newMove += direction;
        }
    } else {
        if(lateralMove) {
            let direction = originCol > destinationCol ? '右' : '左';
            newMove += direction;
        } else if (verticalMove) {
            let direction = originRow < destinationRow ? '直' : '引';
            newMove += direction;
        }
    }
    return newMove;
}

function kanjiValue(kanji) {
    switch(kanji) {
        case('一'):
            return 1
        case('二'):
            return 2
        case('三'):
            return 3
        case('四'):
            return 4
        case('五'):
            return 5
        case('六'):
            return 6
        case('七'):
            return 7
        case('八'):
            return 8
        case('九'):
            return 9
    }
}

function printKifu(arr) {
    let kifu = '';
    arr.forEach((move, i) => {
        kifu += `
${i + 1} ${move}`;
    })
    console.log(kifu);
    $('#output').val(kifu);
}

$(loadPage);