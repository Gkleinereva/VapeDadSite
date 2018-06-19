import { Component, OnChanges, Input } from '@angular/core';

//Required to work with reactive forms
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

//Import our comic service
import {ComicService} from '../comic.service';

//Import our comic and image classes
import {Comic, Image} from '../comic';

@Component({
	selector: 'app-comic-form',
	templateUrl: './comic-form.component.html',
	styleUrls: ['./comic-form.component.css']
})

export class ComicFormComponent implements OnChanges {

	// The comic that might be sent to us from the ComicList component
	@Input() comic: Comic;
	
	comicForm: FormGroup; // <--- heroForm is of type FormGroup

	// Updated to be the user's selected file whenever the user changes a file in the menus
	selectedFile: File;

	constructor(private fb: FormBuilder, private comicService: ComicService) { // <--- inject FormBuilder
		this.createForm();
	}

	createForm() {
		this.comicForm = this.fb.group({
			comicNum: ['', Validators.required], // <--- the FormControl for comicNum
			releaseDate: ['', Validators.required],

			// Nested form group helps us organize things
			// In this case, we're aligning the form structure with our comic class (aka data model)
			// I'm not sure how angular finds out that images conatins image objects...
			images: this.fb.array([])
		});
	}

	// This is called whenever a user picks a comic in the parent ComicListComponent
	// ngOnChanges() {
	// 	this.rebuildForm();
	// }

	// rebuildForm() {
	// 	this.comicForm.reset({});
	// 	this.setImages(this.comic.images);
	// }

	// This tells angular how to get the images FormArray when requested
	get images(): FormArray {
		return this.comicForm.get('images') as FormArray;
	}

	// Called whenever a user changes a file in a form field
	fileChanged(event, arrayIndex) {
		this.selectedFile = event.target.files[0];
	}

	// Called when the user presses the upload button to send a file to the server
	upload() {
		console.log(this.selectedFile);
		this.comicService.uploadImage(this.selectedFile).subscribe();
	}

	// This initializes our 'images' FormArray as an array of FormGroups representing the existing addresses
	// setImages(images: Image[]) {
	// 	// This builds an array of form groups based on the images that we have
	// 	const imageFGs = images.map(image => this.fb.group(image));
	// 	const imageFormArray = this.fb.array(imageFGs);
	// 	// Now, our images FormArray contains FormGroups rather than images themselves
	// 	this.comicForm.setControl('images', imageFormArray);
	// }

	// Adds an image form group to the images array of form groups
	addImage() {
		this.images.push(this.fb.group(new Image()));
	}

	// Compiles form data into the comic object for us to send to the server
	prepareSaveComic() {
		const formModel = this.comicForm.value;

		// Makes copies of the Image objects so that subsequent changes won't mess with the existing data
		const imagesDeepCopy: Image[] = formModel.images.map((image: Image) => Object.assign({}, image));

		// Check if we got passed a comic.  If not, send an ID of null
		let comicId;
		if(this.comic) {
			comicId = this.comic.id;
		}
		else {
			comicId = null;
		}


		// Constructs Comic object from form data
		const saveComic: Comic = {
			id: comicId,
			comicNum: formModel.comicNum as number,
			releaseDate: formModel.releaseDate,
			images: imagesDeepCopy
		};

		return saveComic;
	}

	// Called by the submit button in the form automatically
	onSubmit() {
		console.log("Submitted");
		this.comic = this.prepareSaveComic();
		this.comicService.addComic(this.comic).subscribe();
		//this.rebuildForm();
	}

	ngOnChanges() {
	}

}
