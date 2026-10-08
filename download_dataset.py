import pandas as pd
import zipfile
import io
import requests

url = "https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip"

response = requests.get(url)
response.raise_for_status()

with zipfile.ZipFile(io.BytesIO(response.content)) as z:
    with z.open("SMSSpamCollection") as f:
        df = pd.read_csv(
            f,
            sep="\t",
            header=None,
            names=["label", "message"]
        )

df.to_csv("data/scam_messages.csv", index=False)

print("Dataset downloaded successfully!")
print("Total messages:", len(df))
print()
print(df.head())
print()
print("Label counts:")
print(df["label"].value_counts())