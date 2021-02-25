/*
 * Implementation of solitaire interactions.
 * 
 * [Date]        [Resp.]            [Remarks]
 * 2021-02-23    Victor Prospero    - Creation.
 * 2021-02-24    Victor Prospero    - Game start implemented.
 */
Array.prototype.pushRange = function(range) {
    for (var i = 0; i < range.length; i++)
        this.push(range[i]);
};
Array.prototype.shuffle = function() {
  var source = this;
  var currentIndex = source.length, temporaryValue, randomIndex;
  // while there remain elements to shuffle
  while (0 !== currentIndex) {
    // pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // and swap it with the current element
    temporaryValue = source[currentIndex];
    source[currentIndex] = source[randomIndex];
    source[randomIndex] = temporaryValue;
  }
  return source;
};
Number.prototype.repeatText = function (sText) {
  var r = "";
  for (var i = 0; i < this; i++) r += sText;
  return r;
};
var config = {
  "pip" : {
    "A" : 0,
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
    "clubs" : "black",
    "spades": "black",
    "hearts": "red",
    "diams" : "red"
  }
};
// build a card
function createCard(sPip, sSuit) {
    return {
        container: "",
        deckId: "",
        pip: {
            display: sPip,
            order: config.pip[sPip]
        },
        suit: {
            name: sSuit,
            color: config.suit[sSuit]
        },
        getCssSelector: function() {
            return "div.card[deck=\"" + this.deckId + "\"][pip=\"" + this.pip.order.toString() + "\"][suit=\"" + this.suit.name + "\"]";
        },
        getOuterHtml: function() {
            var iTop = this.pip.order == 1 || this.pip.order == 2 ? 1 :
                       this.pip.order  > 2 && this.pip.order  < 6 ? 2 :
                       this.pip.order == 6 ? 3 :
                       this.pip.order == 7 ? 3 :
                       this.pip.order == 8 ? 3 :
                       this.pip.order == 9 ? 5 : 0;
            var iMid = this.pip.order == 0 || this.pip.order == 2 || this.pip.order == 4 || (this.pip.order > 9) ? 1 :
                       this.pip.order == 5 || this.pip.order == 7 ? 2 :
                       this.pip.order == 6 ? 1 :
                       this.pip.order == 8 ? 3 : 0;
            var iBtm = this.pip.order == 1 || this.pip.order == 2 ? 1 :
                       this.pip.order  > 2 && this.pip.order  < 6 ? 2 :
                       this.pip.order == 6 ? 3 :
                       this.pip.order == 7 ? 3 :
                       this.pip.order == 8 ? 3 :
                       this.pip.order == 9 ? 5 : 0;
            return "<div deck=\"" + this.deckId + "\" pip=\"" + this.pip.order.toString() + "\" suit=\"" + this.suit.name + "\" color=\"" + this.suit.color + "\" class=\"card" + (this.container.substr(0, 6) == "hidden" ? "" : " shown") + "\" style=\"display:none;\">" +
                     "<div>" + this.pip.display + "<br />&" + this.suit.name + ";</div>" +
                     "<ul>" +
                       "<li>&nbsp;<br />" + iTop.repeatText(" &" + this.suit.name + ";") + "</li>" +
                       "<li>&nbsp;<br />" + iMid.repeatText(" &" + this.suit.name + ";") + "</li>" +
                       "<li>&nbsp;<br />" + iBtm.repeatText(" &" + this.suit.name + ";") + "</li>" +
                     "</ul>" +
                     "<div>" + this.pip.display + "<br />&" + this.suit.name + ";</div>" +
                   "</div>";
        }
    };
}
// build a deck of cards
function createDeck(pips, suits, deckID) {
    var lstDeck = [];
    for (var i = 0; i < pips.length; i++)
        for (var j = 0; j < suits.length; j++) {
            var objCard = createCard(pips[i], suits[j]);
            objCard.deckId = deckID;
            lstDeck.push(objCard);
        }
    return lstDeck;
}
// initialize a new game
function newGame(pips, suits, nDecks) {
    var lstCards = [];
    // get the cards
    for (var i = 0; i < nDecks; i++)
        lstCards.pushRange(createDeck(pips, suits, i.toString()));
    // shuffle the cardset
    lstCards.shuffle();
    // load the game definitions
    var gameDefinitions = {
        hiddenHand: [],
        shownHand: [],
        suitGroup: [],
        hiddenTable: [],
        shownTable: [],
        startGame: function(callback) {
            // display the empty table
            $("body")
                .empty()
                .append("<div class=\"container\" id=\"hiddenHand\" />")
                .append("<div class=\"container\" id=\"shownHand\" />");
            var contBounds = document.getElementById('hiddenHand').getBoundingClientRect();
            var contX = (2 * contBounds.x) + contBounds.width;
            var contY = (2 * contBounds.y) + contBounds.height;
            $("#shownHand").css("top", contY.toString() + "px");
            for (var i = 0; i < this.suitGroup.length; i++) {
                $("body")
                    .append("<div class=\"container\" id=\"suitGroup-" + i.toString() + "\" />")
                    .append("<div class=\"container\" id=\"table-" + i.toString() + "\" />");
                $("#suitGroup-" + i.toString())
                    .css("left", contX.toString() + "px");
                $("#table-" + i.toString())
                    .css("left", contX.toString() + "px")
                    .css("top", contY.toString() + "px");
                contX += (contBounds.x + contBounds.width);
            }
            var putTableCards = function (iSuitGroups, hiddenTable, shownTable, hiddenHand, iTable, iCardRow, cb) {
                var cardBounds = document.getElementById("table-" + iTable.toString()).getBoundingClientRect();
                var cardX = cardBounds.x;
                var cardY = cardBounds.y + (iCardRow * 20); // 20 = space between cards of the same "tower"
                var objCard = false;
                if (iCardRow <= iTable) objCard = hiddenTable[iTable][iCardRow];
                else if (iCardRow == (iTable + 1)) objCard = shownTable[iTable][0];
                if (objCard) {
                    var cardSelector = objCard.getCssSelector();
                    if ($(cardSelector).length < 1) {
                        $("body").append(objCard.getOuterHtml());
                        $(cardSelector)
                            .css("left", cardX.toString() + "px")
                            .css("top", cardY.toString() + "px")
                            .show("fast", function() {
                                iTable++;
                                if (iTable >= iSuitGroups) {
                                    iTable = 0;
                                    iCardRow++;
                                }
                                if (iCardRow > iSuitGroups) cb(iSuitGroups, hiddenTable, shownTable, hiddenHand);
                                else putTableCards(iSuitGroups, hiddenTable, shownTable, hiddenHand, iTable, iCardRow, cb);
                            });
                    }
                } else {
                    iTable++;
                    if (iTable >= iSuitGroups) {
                        iTable = 0;
                        iCardRow++;
                    }
                    if (iCardRow > iSuitGroups) cb(iSuitGroups, hiddenTable, shownTable, hiddenHand);
                    else putTableCards(iSuitGroups, hiddenTable, shownTable, hiddenHand, iTable, iCardRow, cb);
                }
            };
            // put the cards on the table
            putTableCards(this.suitGroup.length, this.hiddenTable, this.shownTable, this.hiddenHand, 0, 0, function(iSuitGroups, hiddenTable, shownTable, hiddenHand) {
                putHandCards = function (cards, cardIndex) {
                    if (cardIndex < cards.length) {
                        var cardBounds = document.getElementById("hiddenHand").getBoundingClientRect();
                        $("body").append(cards[cardIndex].getOuterHtml());
                        $(cards[cardIndex].getCssSelector())
                            .css("left", cardBounds.x.toString() + "px")
                            .css("top", cardBounds.y.toString() + "px")
                            .show("fast", function() {
                                putHandCards(hiddenHand, cardIndex + 1);
                            });
                    }
                };
                putHandCards(hiddenHand, 0);
            });
        }
    };
    var nSuits = suits.length * 2;
    for (var i = 0; i < nSuits; i++) {
        gameDefinitions.suitGroup.push([]);
        gameDefinitions.hiddenTable.push([]);
        gameDefinitions.shownTable.push([]);
    }
    // chart the hidden table
    var cardIndex = 0;
    for (var iTable = 0; iTable < nSuits; iTable++)
        for (var iRow = 0; iRow < nSuits; iRow++)
            if (iRow <= iTable) {
                lstCards[cardIndex].container = "hiddenTable";
                gameDefinitions.hiddenTable[iTable].push(lstCards[cardIndex]);
                cardIndex++;
            }
    
    // chart the shown table
    for (var i = 0; i < nSuits; i++) {
        gameDefinitions.shownTable[i].push(lstCards[cardIndex]);
        lstCards[cardIndex].container = "shownTable";
        cardIndex++;
    }
    // hide the others cards to the hiddenHand
    while (cardIndex < lstCards.length) {
        gameDefinitions.hiddenHand.push(lstCards[cardIndex]);
        lstCards[cardIndex].container = "hiddenHand";
        cardIndex++;
    }
    return gameDefinitions;
}
// start the game...
var lstPips = [];
var lstSuits = [];
for (var k in config.pip) lstPips.push(k);
for (var k in config.suit) lstSuits.push(k);
var currentGame = newGame(lstPips, lstSuits, 2);
setTimeout(function() {
    currentGame.startGame();
}, 0);
console.log(currentGame);
