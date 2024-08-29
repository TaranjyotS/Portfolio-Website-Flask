# Portfolio-Website

A Flask web application to create a portfolio according to your role. The web application defines some common pages like [skills](./templates/skills.html), [projects](./templates/projects.html) and [experiences](./templates/experience.html). A [Contact](./templates/contact.html) page has also been added to maintain a database of the users who want to get in touch.

## Folder structure

```text
/app.py
/templates
    |-index.html
    |-skills.html
    |-projects.html
    |-experience.html
    |_contact.html
/static
    |-css
    |   |-fonts
    |   |   |_Font1.ttf
    |   |_style.css
    |-gif
    |   |_gif1
    |-images
    |   |-Folder1
    |   |   |_image1
    |   |_Folder2
    |       |_image1
    |-js
    |   |_scripts.js
    |-publications
    |   |_publication1.pdf
    |_resume
        |resume1.pdf
/build (created after running freeze.py)
/instance (created when the app is run)
/freeze.py
/models.py
/config.py
/requirements.txt
/README.md
```

## How to run the app

1. Install the requirements from [requirements.txt](./requirements.txt) file.
2. Run `app.py`, this will launch the application on your localhost.

```bash
python3 app.py
```

*Note*: The database is created under `./instance` folder by the name `contacts.db`. You can use [DB Browser](https://sqlitebrowser.org/) to analyze the data in the database.

### Make your website static

To make your website static run `freeze.py`, this script will convert your dynamic Flask application into static files. It will create a `/build` directory with all your static files.

## Deploying your website

You can choose how you wish to deploy your website.

1. [Deployment using AWS s3](./doc/aws_s3.md)

**Note**: If you wish to deploy the static website on AWS s3, you might need to set up an API endpoint using AWS API Gateway. For that follow these [steps](#set-up-an-api-endpoint-using-aws-api-gateway).

2. [Deployment using AWS EC2](./doc/aws_ec2.md)
