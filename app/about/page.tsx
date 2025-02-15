import {Box} from "@/components/box";


export default async function AboutPage() {

	return (
		<Box>
			<h1 className="headtext">| About me |</h1>
			<p className="info w400 abouttext">Hello, my name is NATroutter i'm 26 years old programmer/gamer/furry from finland who loves to mess with Java and play games with friends and watch anime</p>
			<p className="info w700">Languages: <span className="w400">Finnish (Native), English (Advanced)</span></p>
			<p className="info w700">Favourite Shows: <span className="w400">Beastars, BNA, The Blacklist</span></p>
			<p className="info w700">Favourite Games: <span className="w400">Minecraft, Tower Unite, Rust</span></p>

			<h1 className="headtext mt-12">| Programming |</h1>
			<p className="info w400 abouttext">I love spending my time coding different projects mostly i like to use java or php but i have done some project with other languages as well but java and php are my favourites</p>
			<p className="info w700">Languages: <span className="w400">PHP, Java, JavaScript, C#, Curl, Lua, SQL</span>
			</p>

			<h1 className="headtext mt-12">| Links |</h1>
			<div className="about_links">
				<p className="info w700">Github: <a className="w400" target="_blank" href="https://github.com/natroutter">NATroutter</a>
				</p>
				<p className="info w700">Twitter: <a className="w400" target="_blank" href="https://twitter.com/natroutter">@NATroutter</a>
				</p>
				<p className="info w700">MyAnimeList: <a className="w400" target="_blank" href="https://myanimelist.net/animelist/NATroutter">NATroutter</a>
				</p>
				<p className="info w700">Discord: <a className="w400" target="_blank" href="http://discordapp.com/users/162669508866211841">NATroutter#1648</a>
				</p>
				<p className="info w700">Steam: <a className="w400" target="_blank" href="https://steamcommunity.com/id/batroutter">batroutter</a>
				</p>
			</div>
		</Box>
	);
}
