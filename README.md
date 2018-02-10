# IllustratedDictionary
Illustrated dictionary for Kamusi Project

### How to run the project
1. Run MongoDB server at ```mongodb://localhost:27017/```
2. Navigate to root directory of project and run ```node express.js```
3. Open browser type ```localhost:3000``` in the url

### Step by step run through of the app
1. upload an image onto the app.
    - image will be chunked and saved in MongoDB pictures database as fs.chunks and fs.files
2. User will be redirected to ```imageTagging.ejs``` file
3. Select the language that you will be typing in
4. Click on the image to begin tagging
    - The tag can be moved around by dragging the tag and resized by moving the edges
    - Click on the check mark to confirm tag placement
5. After clicking the confirming the tag placement, enter the word (in the language that you selected) for the tag. Then hit the Add Tag button
6. The user will be presented with a modal-box with all possible concepts of the word
    - This is done by querying the Kamusi API. See the ```/sendTerm``` middleware in the ```express.js``` file
    - Save the concept into the tag by clicking the box around the concept you would like to save
        - Saving the concept is done by taking the english concept synset id from the API's returned JSON data and saving this id into a custom html data attribute called ```data-engSynsetIdHTML```
7. Repeat the tagging process over again if you would like to add more tags.
8. After you finish adding all the tags you want, **you must hit the SAVE TAGS button** to save all the tags to the database.
    - If you have previously saved tags and would like to update the tags, simply just press save tags again to update. 
    - The process in which we save tags is by deleting ALL tags associated with that imageId and then replacing with the new tags that you would like to save.
9. Hit the Translate Tags button to proceed to translating.
10. Change the language to what you would like to translate the tags to.
11. Click the tag to show the translated words on the box on the right.
  - This translation is done by taking each tag and running them through the Kamusi API.
  - We use the custom html data attribute ```data-engSynsetIdHTML``` to take the english concept id and query it into the API to be translated.
  - See ```translating.js``` file around line 42~
12. You can hit edit tags to go back to editing mode

### Things to keep in mind
1. Currently, the way we pull images is by the name that it is uploaded by. For example, if an image is uploaded as 'house.jpg', the app will search the database for 'house.jpg' and pull it. However this is a problem if there are multiple 'house.jpg' images. A better way would be to search and pull image by the unique image id.
2. In editing mode, if you save a tag, you are allowed to drag and resize it after confirming it's position. However, for some reason, you can only do this once. After dragging and resizing it once, it won't move again. 
3. Make sure to clear out your database every once in a while. There is currently no way to delete images on the database.
    - Open the Mongo Shell and run ```use pictures``` then run ```db.dropDatabase()```
