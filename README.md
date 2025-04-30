
Installation Guide:
1) clone this repository
2) Install node.js
3) In the code directory (root level), create a file called ‘.env’ and paste the following text into it:
	MONGO_URI = “your_db_URI”
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=”your_google_api_key”
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
EMAIL_USER= “your_email_address”
EMAIL_PASS= “your_google_apps_password”
JWT_SECRET=“use_any_string”
NEXTAUTH_SECRET=”use_any_string”
4) Run the command ‘npm install’.
5) Set up the mongodb database by reading the ‘README_DATABASE.txt’.
6) Run the command ‘npm run dev’, and go to the provided url.
