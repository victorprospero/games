//TODO: Container methods


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
    "1" : "Ace",
    "2" : "2",
    "3" : "3",
    "4" : "4",
    "5" : "5",
    "6" : "6",
    "7" : "7",
    "8" : "8",
    "9" : "9",
    "10": "10",
    "J" : "Jack",
    "Q" : "Queen",
    "K" : "King"
  },
  "suit" : {
    "Clubs"   : "Black",
    "Spades"  : "Black",
    "Hearts"  : "Red",
    "Diamonds": "Red"
  }
};

// build a card
function createCard(pip, suit) {
	var sPip = config.pip[pip];
	var sColor = config.suit[suit];
	return {
		container: "",
		pip: {
			code: pip,
			name: sPip
		},
		suit: {
			name: suit,
			color: sColor
		},
		getImage: function() {
			return "Images/Card_" + this.suit.name + "_" + this.pip.name + ".png";
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
		if (i < l) {
			for (var i = 0; i < l; i++) {
				console.log(l.toString() + "-" + i.toString());
				containers.hiddenTable[i].push(lstCards[cardIndex]);
				lstCards[cardIndex].container = "hiddenTable";
				cardIndex++;
			}
			chartHiddenTable(l - 1);
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