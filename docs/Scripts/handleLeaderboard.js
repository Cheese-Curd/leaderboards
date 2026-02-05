function print(str)
{
	console.log("[Leadboard Handler/LOG] " + str)
}

const githubPath = "https://api.github.com/repos/Cheese-Curd/leaderboards/contents/leaderboards/"

const leaderboardDiv = document.getElementById("leaderboard")
const loadingTxt     = document.getElementById("loadingTxt")
const notFoundDiv    = document.getElementById("notFound")
const titleText      = document.getElementById("headerTitle")

const gameName     = document.getElementById("game")
const bannerDiv    = document.getElementById("bannerImage")
const catagoryName = document.getElementById("catagory")

const leaderboardTable = document.querySelector(".lbList");

async function fetchGitHubJSON(url) {
	const res = await fetch(url);
	const data = await res.json();

	if (!data.content)
		throw new Error("[Leaderboard Handler/GITHUB] Not a valid JSON file: " + url);

	const decoded = atob(data.content);
	return JSON.parse(decoded);
}

async function fetchGameCatagories(url)
{
	const res   = await fetch(url)
	const files = await res.json()

	var catagories = {}

	for (const file of files)
	{
		if (file.type !== "file") continue // not a file

		const json = await fetchGitHubJSON(file.url)
		catagories[file.name.replace(".json", "")] = json;
	}

	return catagories
}

async function handleLeaderboard(visible)
{
	leaderboardDiv.style.display = "none"

	print("Game Selected: " + visible)
	if (visible)
	{
		const gamePath = githubPath + game
		loadingTxt.style.display = "block"
		
		if ((await fetch(gamePath)).ok)
		{
			print("Found game!")
			const data = await fetchGitHubJSON(gamePath + "/data.json")
			
			// This is for the games banner 'n stuff,
			// basically I want to keep it in the site's root when it's the generic one,
			// but if it's not that, then fetch it in the game's root
			var bannerPath = ""
			if (data.banner == "generic_banner.png")
				bannerPath = data.banner
			else
				bannerPath = `leaderboards/${game}/${data.banner}`

			bannerDiv.style.backgroundImage = `url('${bannerPath}')`
			gameName.innerText = data.name
			print("Loaded name & banner")

			
			var catagories = await fetchGameCatagories(gamePath + "/catagories")
			
			if (catagory == null)
				catagory = "any%"

			var curCatagory = catagories[catagory]
			if (!curCatagory) // Fall back
				curCatagory = catagories["any%"]

			// Actual leaderboard stuff
			catagoryName.innerText = curCatagory.name

			// Handle leaderboard sorting and adding to the table
			const lboard = curCatagory.leaderboard
			Object.keys(lboard)
				.sort((a, b) => Number(a) - Number(b))
				.forEach(rank => {
					const entry = lboard[rank];
					const [runner, RTA, reTimed, date, verified] = entry;

					const tr = document.createElement("tr");

					tr.innerHTML = `
					<td class="rank">${rank}</td>
						<td class="runner">${runner}</td>
						<td>${RTA}</td>
						<td>${reTimed}</td>
						<td>${date}</td>
					<td>${verified ? "Yes" : "No"}</td>
					`;

					leaderboardTable.appendChild(tr);
				});
			
			// Hide loading text, and show the leaderboard which (hopefully) should have times
			loadingTxt.style.display = "none"
			leaderboardDiv.style.display = "block"
		}
		else
		{
			print("Could not find game!")
			titleText.innerText = "! 404 !"
			loadingTxt.style.display = "none"
			notFoundDiv.style.display = "block"
		}
	}
}

console.log(
	"%c-[ Leaderboard Handler Loaded ]-",
	"font-size: 24px; font-weight: bold; text-align: center; width: 100%; display: block;"
);
console.log(
	"%c> Version 1.0.0 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);

const params   = new URLSearchParams(window.location.search);
var game     = params.get("game")
var catagory = params.get("catagory")

handleLeaderboard(game != null)