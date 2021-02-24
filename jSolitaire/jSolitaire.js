/*
 * Implementation of solitaire interactions.
 * 
 * [Date]        [Resp.]            [Remarks]
 * 2021-02-23    Victor Prospero    Creation.
 */
Array.prototype.pushRange = function(range) {
	for (var i = 0; i < range.length; i++)
		this.push(range[i]);
};
Array.prototype.shuffle = function() {
  var source = this;
  var currentIndex = source.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = source[currentIndex];
    source[currentIndex] = source[randomIndex];
    source[randomIndex] = temporaryValue;
  }
  return source;
};
var config = {
  "pip" : {
    "1" : 0,
    "2" : 1,
    "3" : 2,
    "4" : 3,
    "5" : 4,
    "6" : 5,
    "7" : 6,
    "8" : 7,
    "9" : 8,
    "10": 9,
    "J" : 10,
    "Q" : 11,
    "K" : 12
  },
  "suit" : {
    "Clubs"   : "#000",
    "Spades"  : "#000",
    "Hearts"  : "#f00",
    "Diamonds": "#f00"
  }
};

// build a card
function createCard(sPip, sSuit) {
	var sColor = config.suit[sSuit];
	return {
		container: "",
		pip: sPip,
		suit: {
			name: sSuit,
			color: sColor
		},
		getImage: function() {
			return "Images/Card_" + this.sSuit.name + "_" + this.sPip + ".png";
		}
	};
}
// build a deck of cards
function createDeck(pips, suits) {
    var lstDeck = [];
    for (var i = 0; i < pips.length; i++)
        for (var j = 0; j < suits.length; j++)
            lstDeck.push(createCard(pips[i], suits[j]));
    return lstDeck;
}
// initializes a new game
function newGame(pips, suits, nDecks, callback) {
	var lstCards = [];
	//get the cards
	for (var i = 0; i < nDecks; i++)
		lstCards.pushRange(createDeck(pips, suits));
	//shuffle the cardset
	lstCards.shuffle();
	//load the game containers
	var containers = {
		suitGroup: [],
		hiddenTable: [],
		shownTable: [],
		hiddenHand: [],
		shownHand: []
	};
	var nSuits = suits.length * 2;
	for (var i = 0; i < nSuits; i++) {
		containers.suitGroup.push([]);
		containers.hiddenTable.push([]);
		containers.shownTable.push([]);
	}
	//chart the hidden table
	var cardIndex = 0;
	var chartHiddenTable = function(l, cb) {
		if (l > 0) {
			for (var i = 0; i < l; i++) {
				lstCards[cardIndex].container = "hiddenTable";
				containers.hiddenTable[i].push(lstCards[cardIndex]);
				cardIndex++;
			}
			chartHiddenTable(l - 1, cb);
		} else cb();
	};
	chartHiddenTable(nSuits, function() {
		// chart the shown table
		for (var i = 0; i < nSuits; i++) {
			containers.shownTable[i].push(lstCards[cardIndex]);
			lstCards[cardIndex].container = "shownTable";
			cardIndex++;
		}
		//hide the others cards to the hiddenHand
		while (cardIndex < lstCards.length) {
			containers.hiddenHand.push(lstCards[cardIndex]);
			lstCards[cardIndex].container = "hiddenHand";
			cardIndex++;
		}
		callback(containers);
	});
}
var lstPips = [];
var lstSuits = [];
for (var k in config.pip) lstPips.push(k);
for (var k in config.suit) lstSuits.push(k);
newGame(lstPips, lstSuits, 2, function(containers) {
	console.log(containers);
});
