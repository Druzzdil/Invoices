
function readNumbers(number, words)
{
    words = "";
    var J = ["", " jeden", " dwa", " trzy", " cztery", " pięć", " sześć", " siedem", " osiem", " dziewięć"];
    var N = ["", " jedenaście", " dwanaście", " trzynaście", " czternaście", " piętnaście", " szesnaście", " siedemnaście", " osiemnaście", " dziewietnaście"];
    var D = ["", " dziesięć", " dwadzieścia", " trzydzieści", " czterdzieści", " pięćdziesiąt", " sześćdziesiąt", " siedemdziesiąt", " osiemdziesiąt", " dziewięćdziesiąt"];
    var S = ["", " sto", " dwieście", " trzysta", " czterysta", " pięćset", " sześćset", " siedemset", " osiemset", " dziewięćset"];
    var groups = [
        ["" ,"" ,""],
        [" tysiąc" ," tysiące" ," tysięcy"],
        [" milion" ," miliony" ," milionów"],
        [" miliard"," miliardy"," miliardów"],
        [" bilion" ," biliony" ," bilionów"],
        [" biliard"," biliardy"," biliardów"],
        [" trylion"," tryliony"," tryliardów"]];

    if (!isNaN(number)){

        var result = '';
        var char = '';
        if (number == 0)
            result = "zero";
        if (number < 0) {
            char = "minus";
            number = number;
        }

        var g = 0;
        while (number > 0) {
            var s = Math.floor((number % 1000)/100);
            var n = 0;
            var d = Math.floor((number % 100)/10);
            var j = Math.floor(number % 10);
            if (d == 1 && j>0) {
                n = j;
                d = 0;
                j = 0;
            }

            var k = 2;
            if (j == 1 && s+d+n == 0)
                k = 0;
            if (j == 2 || j == 3 || j == 4)
                k = 1;
            if (s+d+n+j > 0)
                result = S[s]+D[d]+N [n]+J[j]+groups[g][k]+result;

            g++;
            number = Math.floor(number/1000);
        }

        words = char + result;
        return words;
    }
}