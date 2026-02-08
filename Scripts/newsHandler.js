var newsBox    = null
var newsToggle = null

async function initNews()
{
	newsBox = document.createElement("div")
	newsBox.id = "newsBox"
	document.body.appendChild(newsBox)

	var newsContainer = document.createElement("div")
	newsContainer.id = "newsToggleContainer"

	newsToggle = document.createElement("a")
	newsToggle.id = "newsToggle"
	newsToggle.className = "headerBtn"
	newsToggle.innerText = "Show News"
	newsToggle.href = "javascript:void(0)"

	var newsBoxOpen = false
	newsToggle.addEventListener('click', function()
	{
		newsBoxOpen = !newsBoxOpen
		newsBox.style.transform = `translatex(${newsBoxOpen ? "100%" : "0%"})`
		newsToggle.innerText = newsBoxOpen ? "Hide News" : "Show News"
	})

	header.appendChild(newsContainer)
	newsContainer.appendChild(newsToggle)
}


/*
	News data should contain the following:

	id:      ID of the post
	data:    Date when made
	poster:  UUID of the poster
	gameID:  gameID of the game
	title:   Post title
	content: Content of the post
*/
async function addNews(data)
{
	var post = document.createElement("a")
	post.className = "menu post"

	var formattedTime = timestampToTable(data.date);

	var iconSpan = document.createElement("span")
	iconSpan.style.width = "5vw"
	post.appendChild(iconSpan)

	var icon = document.createElement("img")
	icon.src = getIconString(validGames[data.gameID].icon)
	icon.className = "postIcon"

	iconSpan.appendChild(icon)

	var postSpan = document.createElement("span")
	post.appendChild(postSpan)
	
	var postPoster = document.createElement("div")
	postPoster.className = "postPoster"
	postPoster.innerText = `${getDisplayNameFromUUID(data.poster)} · ${formattedTime.Date} at ${formattedTime.Time}`
	postSpan.appendChild(postPoster)

	var postTitle = document.createElement("div")
	postTitle.className = "postTitle"
	postTitle.innerText = data.title
	postSpan.appendChild(postTitle)

	newsBox.appendChild(post)

	post.href = "javascript:void(0)"

	post.addEventListener('click', function() {
		window.location.href = "./post?id=" + data.id
	})
}

async function handlePost()
{
	// Because the post ID is sequential, you can just do id-1 to get the correct index
	const id = parseInt(params.get("id")) - 1
	const postData = newsData[id]

	const formattedTime = timestampToTable(postData.date);

	document.getElementById("headerTitle").innerText = postData.title
	document.getElementById("newsPost").innerText    = postData.content

	document.getElementById("poster").innerText = `${getDisplayNameFromUUID(postData.poster)} · ${formattedTime.Date} at ${formattedTime.Time}`
}