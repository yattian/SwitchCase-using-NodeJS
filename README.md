# SwitchCase

This is a custom Switch Case upload for mini switch cases. The purpose of this website is to upload any custom artwork and print them into mini switch cases to sell to customers.

After forking, npm install to get all dependencies. Now starting the local server with npm run start. The port should be set to 5000. Navigate to http://localhost:5000/index. 

This is what the home screen currently looks like. 
![Screenshot 2023-02-28 104605](https://user-images.githubusercontent.com/62085787/221693029-b52c789d-f74c-4378-a121-17957763ff5f.png)

## Uploading Custom Images

By pressing the 'Upload Custom Image' button, you can select an image to upload that you want on your mini switch case. Press 'Add to Cart'. As you can see, I've chosen three covers here and ordered two copies for Zelda.
![Screenshot 2023-02-28 104915](https://user-images.githubusercontent.com/62085787/221693664-927244c0-9093-459e-9c68-1f88b2257c5d.png)

Proceed to checkout to Stripe platform. 
![Screenshot 2023-02-28 105803](https://user-images.githubusercontent.com/62085787/221695249-c0edf309-688c-43d3-9ffb-f45a0034e287.png)

Fill in any information but for a successful test you must enter:

Card Number: 4242 4242 4242 4242

Expiry: Any future date

CSV: Any


After submitting, you should be redirected to the succesful page. 
![Screenshot 2023-02-28 110045](https://user-images.githubusercontent.com/62085787/221695755-83e3fc0c-111e-45aa-9973-76d6d7db70ae.png)

I can also see that the payment went through on my Stripe dashboard.
![Screenshot 2023-02-28 110127](https://user-images.githubusercontent.com/62085787/221695884-0976226c-c6e9-4dbc-83e0-f19623e027ab.png)

## Testing
* Cannot add to cart when no image (Probably should grey the button out instead)
* Removing, adding, changing quantity cannot be abused
* Inspect HTML to change price does not work when proceeding to Stripe

## Future work
* Add some sort of login feature
* Add an email confirmation feature
* Need some backend (Django?) to store images
