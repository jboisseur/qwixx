<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Play Qwixx online</title>
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
        <script src="https://kit.fontawesome.com/7d59c9faf1.js" crossorigin="anonymous"></script>
        <script src="script.js" defer></script>
    </head>
    <body>
        <?php 
          // Handling Best score form
          if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $nameToAdd = $_POST["name"];
            // Remove any character that is not a letter, a digit or a white space: use a regular expression to do so $nameToAdd = nameCleaned
          };

          if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $scoreToAdd = $_POST["score"];
            // Change it to an INT and verify it's not more than the maximum
          };

          
        function test_input($data) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
        ?>
        <nav>
            <ul>
                <li><a href="#playQwixx">Play Qwixx</a></li>
                <li><a href="#bestScoreZone">Best scores</a></li>
                <li><a href="#rules">Rules</a></li>
            </ul>
        </nav>

        <div id="playQwixx">
            <div id="diceZone">
                <button type="button" id="rollDiceButton" onclick="newTurn()">Roll</button>
                <div id="displayDice"></div>
            </div>
            <table id="playerSheet">
                <thead>
                    <tr>
                        <th scope="colgroup" colspan="11" contenteditable="true" id="playerName">Enter your name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="redbg">
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>12</td>
                    </tr>
                    <tr class="yellowbg">
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                        <td>8</td>
                        <td>9</td>
                        <td>10</td>
                        <td>11</td>
                        <td>12</td>
                    </tr>
                    <tr class="greenbg">
                        <td>12</td>
                        <td>11</td>
                        <td>10</td>
                        <td>9</td>
                        <td>8</td>
                        <td>7</td>
                        <td>6</td>
                        <td>5</td>
                        <td>4</td>
                        <td>3</td>
                        <td>2</td>
                    </tr>
                    <tr class="bluebg">
                        <td>12</td>
                        <td>11</td>
                        <td>10</td>
                        <td>9</td>
                        <td>8</td>
                        <td>7</td>
                        <td>6</td>
                        <td>5</td>
                        <td>4</td>
                        <td>3</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td colspan="7"></td>
                        <td>-5</td>
                        <td>-5</td>
                        <td>-5</td>
                        <td>-5</td>
                    </tr>
                </tbody>
            </table>
            <div id="messageZone"></div>
        </div>

        <div id="bestScoreZone">
            <h2>Best scores</h2>
            <ul id="bestScoreList"></ul>
        </div>

        <hr>

        <section id="rules">
            <h2>Rules</h2>
            <p>Source: <cite><a href="https://www.fgbradleys.com/rules/rules4/Qwixx%20-%20rules.pdf" title="external PDF file containing Qwixx rules">Rules (PDF file)</a></cite></p>
            <h3>Goal</h3>
                <p>Score the most points by crossing out as many numbers in the four color-rows as possible while avoiding penalty points.</p>
            <h3>How to play</h3>
                <p>In this solo version, you're always the "main player" and roll all six die every turn. You have to cross at least one number (into the four color-rows or a penalty) and a maximum of two into the four color-rows.</p>
                <p>The cell you can cross is either:</p>
                    <ul>
                        <li>a penalty cell;</li>
                        <li>or the number corresponding to the sum of white dice, anywhere;</li>
                        <li>and/or the number corresponding to the sum of a white dice and a color dice in the row corresponding to the dice color.</li>
                    </ul>
                <p>Numbers must be crossed out from left to right in each of the four color-rows. You do not have to begin with the number farthest to the left, but if you skip any numbers, they cannot be crossed out afterward.</p>
                <p>If you wish to cross out the number at the extreme right end of a color-row you must have first
                    crossed out at least five numbers in that row. Crossing this last number will increment your number of cells crossed in a row by 1 and lock the line (which has effect on other players in a multiplayer version).
                </p>
                <p>The more you cross cells on a color-row, the more points you get, see below. A penalty cell costs 5 points.</p>
                <table>
                    <thead>
                        <tr>
                            <th scope="colgroup" colspan="13">Score table</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>X</td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>11</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>#</td>
                            <td>1</td>
                            <td>3</td>
                            <td>6</td>
                            <td>10</td>
                            <td>15</td>
                            <td>21</td>
                            <td>28</td>
                            <td>36</td>
                            <td>45</td>
                            <td>55</td>
                            <td>66</td>
                            <td>78</td>
                        </tr>
                    </tbody>
                </table>
            <h3>End of game</h3>
                <p>The game ends if either:</p>
                    <ul>
                        <li>The four penalty cells are crossed;</li>
                        <li>Two lines are locked.</li>
                    </ul>
                <p>Total score is calculted as follows: sum of points per color-row (see table above) minus penalty points if any.</p>
            </section>

        <footer>
            <h3>Credits</h3>
            <p>Qwixx is a boardgame created by Steffen Benndorf and illustrated by O. &amp; S. Freudenreich.<br>
            This flawed web version is the work of <a href="https://julietoral.ovh/" title="Julie's webdev blog">Julie Boissière-Vasseur</a>, as part of webdevelopment studies.</p>
        </footer>

    </body>
</html>