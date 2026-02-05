/* SUPABASE API URL/PUBLIC KEY */
const SUPABASE_URL      = "https://auzlaekgsxpgyzyumrix.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8mPxMb0aEr51tf_CWMPBIw_hp0Go8Ru";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
const categoryName = document.getElementById("category")

const leaderboardTable = document.querySelector(".lbList");

const webTitle = document.getElementById("webTitle")

async function fetchGitHubJSON(url) {
	const res = await fetch(url);
	const data = await res.json();

	if (!data.content)
		throw new Error("[Leaderboard Handler/GITHUB] Not a valid JSON file: " + url);

	const decoded = atob(data.content);
	return JSON.parse(decoded);
}

async function fetchGameCategories(url)
{
	const res   = await fetch(url)
	const files = await res.json()

	var categories = {}

	for (const file of files)
	{
		if (file.type !== "file") continue // not a file

		const json = await fetchGitHubJSON(file.url)
		categories[file.name.replace(".json", "")] = json;
	}

	return categories
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
			webTitle.innerText = "Leaderboards - Loading..."

			print("Found game!")

			const { data, error } = await supabaseClient
				.from("test_game_any")
				.select("*")

			if (error)
				console.error(error)
			else
			{
				if (data.length == 0)
				{
					const tr = document.createElement("tr");
					tr.innerHTML = `
					<td colspan="6" style="text-align:center; font-style:italic;">
						No runs yet...
						Maybe you can!
					</td>
					`;
					leaderboardTable.appendChild(tr);
				}
				else
				{
					data.forEach(runner => {
						const tr = document.createElement("tr");

						tr.innerHTML = `
						<td class="rank">${runner.Rank}</td>
							<td class="runner">${runner.Runner}</td>
							<td>${runner.RTA}</td>
							<td>${runner.ReTimed}</td>
							<td>${runner.Date}</td>
						<td>${runner.Verified ? "Yes" : "No"}</td>
						`;

						leaderboardTable.appendChild(tr);
					})
				}
			}
			print("test")

			/*
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
			
			var categories = await fetchGameCategories(gamePath + "/categories")
			
			if (category == null)
				category = "any%"

			var curcategory = categories[category]
			if (!curcategory) // Fall back
				curcategory = categories["any%"]

			// Actual leaderboard stuff
			categoryName.innerText = curcategory.name

			sCategory = category.replace("%", "")

			print(`${game}_${sCategory}`)

			

			// var { lboard, error } = await supabaseClient
			// 	.from('test_game_any')
			// 	.select("*")

			// if (error)
			// 	console.error(error)
			// else
			// {
			// 	print(lboard)
			// 	// lboard.forEach( entry => {
			// 	// 	console.log(entry.Rank)
			// 	// 	console.log(entry.Runner)
			// 	// })
			// }

			const { lboard, error } = await supabaseClient
				.from("test_game_any")
				.select("*")

			if (error)
				console.error(error)
			else
				console.log(lboard)

			// Handle leaderboard sorting and adding to the table
			print(lboard)
			if (lboard.length === 0)
			{
				const tr = document.createElement("tr");
				tr.innerHTML = `
					<td colspan="6" style="text-align:center; font-style:italic;">
						No runs yet...
						Maybe you can!
					</td>
				`;
				leaderboardTable.appendChild(tr);
			}
			else
			{
				lboard.forEach(runner => {
					const tr = document.createElement("tr");

					tr.innerHTML = `
					<td class="rank">${runner.Rank}</td>
						<td class="runner">${runner.Runner}</td>
						<td>${runner.RTA}</td>
						<td>${runner.ReTimed}</td>
						<td>${runner.Date}</td>
					<td>${runner.Verified ? "Yes" : "No"}</td>
					`;

					leaderboardTable.appendChild(tr);
				})
			}

			
			webTitle.innerText = "Leaderboards - " + data.name
			*/

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
	"%c> Version 1.1.2 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);

const params   = new URLSearchParams(window.location.search);
var game     = params.get("game")
var category = params.get("category")

handleLeaderboard(game != null)