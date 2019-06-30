import { PhotoFormatModel } from "./photo-format";
import { PhotoFormat } from "@/data/enums/photo-enums";

export type PhotoFormatsDictionary = {
	[k in PhotoFormat]?: PhotoFormatModel;
}

export class PhotoModel {
	uuid: string;
	src: string;
	width: number;
	height: number;
	description: string;
	formats: PhotoFormatsDictionary = {};
}