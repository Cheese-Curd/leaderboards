function print(str)
{
	console.log("[Leadboard Handler] " + str)
}

function getGameData()
{
	print("Getting Game Data...")
	if (catagory == null)
		catagory = "any%"

	print("Game: " + game)
	print("Game Name: ")
	print("Catagory: " + catagory)
}

function handleLeaderboard(visible)
{
	const leaderboardDiv = document.getElementById("leaderboard")

	print("Game Selected: " + visible)
	if (visible)
	{
		

		const gameName = document.getElementById("game")
		const catagoryName = document.getElementById("catagory")

		gameName.innerText = game
		catagoryName.innerText = catagory
	}
	else
	{
		leaderboardDiv.style.display = "none"
	}
}

console.log("-[ Leaderboard Handler Loaded ]-")

const params   = new URLSearchParams(window.location.search);
var game     = params.get("game")
var catagory = params.get("catagory")

handleLeaderboard(game != null)