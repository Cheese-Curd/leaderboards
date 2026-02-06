function hPrint(src)
{
	console.log("[Header/LOG] " + src)
}

function makeHeaderButton(text, url)
{
	hPrint("Making header button: " + text)
	var a = document.createElement("a")
	a.className = "headerBtn"
	a.href = url
	a.innerText = text

	header.appendChild(a)
}

const header = document.getElementById("header")

console.log(
	"%c-[ Header Script Loaded ]-",
	"font-size: 24px; font-weight: bold; text-align: center; width: 100%; display: block;"
);
console.log(
	"%c> Version 1.0.0 <",
	"font-size: 18px; text-align: center; width: 100%; display: block;"
);

makeHeaderButton("Home", "/")