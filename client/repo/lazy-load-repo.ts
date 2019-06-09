import { LazyLoadImageContainer, LazyLoadObject } from "../components/lazy-load/lazy-load-image-container";

type IntersectionObserverEntryV2 = IntersectionObserverEntry & {
	isVisible: boolean;
}

type IntersectionObserverInitV2 = IntersectionObserverInit & {
	trackVisibility: boolean;
}

export class LazyLoadRepo {
	private _images: LazyLoadObject[] = [];
	private _observer: IntersectionObserver;

	constructor() {
		this._observer = new IntersectionObserver(this._onIntersection, {
			threshold: [.1],
			trackVisibility: true,
			delay: 100
		} as IntersectionObserverInitV2);
	}

	private _onIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		for (const entry of entries) {
			const change = entry as IntersectionObserverEntryV2;
			if (typeof change.isVisible === 'undefined') {
				change.isVisible = true;
			}
			if (change.isIntersecting && change.isVisible) {
				// const target = change.target;
				const targetIndex = this._images
					.findIndex(x => x.element === change.target);
				if (targetIndex === -1)
					continue;
				this._images[targetIndex].intersecting();
				this.remove(this._images[targetIndex]);
			}
		}
	}

	add = (...images: LazyLoadObject[]) => {
		
		images.forEach(image => {
			this._observer.observe(image.element);
		})
		
		this._images = [
			...this._images,
			...images
		];
	}

	remove = (image: LazyLoadObject) => {
		const imageIndex = this._images.indexOf(image);
		if (imageIndex === -1)
			return;

		this._observer.unobserve(image.element);

		this._images = [
			...this._images.slice(0, imageIndex),
			...this._images.slice(imageIndex +1)
		];
	}
};

export const buildLazy = () => new LazyLoadRepo();