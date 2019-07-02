import { CategoryEntity } from "../../data/entities/category-entity";
import { ArticleEntity } from "../../data/entities/article-entity";
import faker from 'faker';
import { sequentiallyResolvePromises } from "../../utils/utils";
import { UserEntity } from "@/data/entities/user-entity";
import { autoInjectable, inject } from "tsyringe";
import { IOCSymbols } from "../ioc";
import { Mapper } from "@wufe/mapper";
import { UserRole } from "@/data/enums/user-enums";

@autoInjectable()
export class DatabaseSeeder {
	constructor(
		@inject(Mapper) private _mapper?: Mapper,
		@inject(IOCSymbols.ADMIN_EMAIL) private _adminEmail?: string,
		@inject(IOCSymbols.ADMIN_PASSWORD) private _adminPassword?: string,
	) {}

	async seedDatabase() {
		let user = await UserEntity.findOne({ where: { email: this._adminEmail }});
		if (!user) {
			console.log('Admin not found: creating..');
			user = new UserEntity();
			user.email = this._adminEmail;
			user.password = this._adminPassword;
			user.role = UserRole.ADMIN;
			user.username = 'Administrator';
			await user.save();
		}
	}
}