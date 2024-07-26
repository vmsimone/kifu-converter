function loadPage() {
    //do something
    $('button').on('click', () => {
        const input = $('#input').val().trim();
        replaceWords(input);
    })
}

function replaceWords(input) {
    let output = input.replace('Resigns', '投了');
    output = output.replace(/\[Diagram.*\]/g, '');

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

    organizeMoves(output);
}

function organizeMoves(input) {
    let movesArr = input.split(';').join('').split(' ');
    let organizedArr = [];

    movesArr.forEach((move, i) => {
        let prevMove = movesArr[i - 1];

        let moveIsCapture = move.indexOf('x') > -1;
        let moveIsDrop = move.indexOf('*') > -1;

        move = move.replace('+', '成');
        move = move.replace('=', '不成');

        if (move === '投了') {
            organizedArr.push(move);
        } else if(moveIsCapture) {
            move = captureHandler(move, prevMove);
            organizedArr.push(move);
        } else {
            if(moveIsDrop) {
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

    // console.log(output);
}

function captureHandler(move, prevMove) {
    return 'xxx'
}

function printKifu(arr) {
    let kifu = '';
    arr.forEach((move, i) => {
        kifu += `
        ${i + 1} ${move}`;
    })
    console.log(kifu)
}

$(loadPage);