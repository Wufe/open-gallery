import { injectable, inject } from "tsyringe";
import { Connection, BaseEntity } from "typeorm";
import { Mapper } from "@wufe/mapper";

class RelatedEntitiesBuilder<TEntity> {
	constructor(
		private mapper: Mapper,
		private connection: Connection
	) {}

	private _relatedEntity: { new(): TEntity };
	forEntity(entity: { new(): TEntity }) {
		this._relatedEntity = entity;
		return this;
	}

	private _property: keyof TEntity;
	withProperty(property: keyof TEntity) {
		this._property = property;
		return this;
	}

	private _id: number = undefined;
	byId(id: number) {
		this._id = id;
		return this;
	}

	private _skip: number = undefined;
	skip(by: number) {
		this._skip = by;
		return this;
	}

	private _take: number = undefined;
	take(by: number) {
		this._take = by;
		return this;
	}

	private throwNullException = (name: 'entity' | 'property' | 'id') => {
		throw new Error(`ArgumentNullException: ${name} not valid: got ${this[name]}`);
	}

	private createQuery = <T>() => {
		if (!this._property)
			this.throwNullException('property');
		if (!this._id)
			this.throwNullException('id');
		if (!this._relatedEntity)
			this.throwNullException('entity');

		return this.connection
			.getRepository(this._relatedEntity)
			.createQueryBuilder('entity_alias')
			.innerJoinAndSelect(`entity_alias.${this._property}`, 'joined_entity_alias')
			.where('joined_entity_alias.id = :id', { id: this._id })
	}

	getMany = async <T>(): Promise<T[]> => {
		const entities = await this.createQuery()
			.skip(this._skip)
			.take(this._take)
			.getMany();
			
		return entities
			.map(entity => this.mapper.map(entity));
	}

	get = async <T>(): Promise<T> => {
		const entity = await this.createQuery()
			.getOne();
			
		return this.mapper.map(entity);
	}
}

@injectable()
export class GenericRepository {
	constructor(
		@inject(Mapper) private mapper: Mapper,
		@inject(Connection) private connection: Connection) {}

	getRelated<TEntity>(entity: { new(): TEntity }) {
		return new RelatedEntitiesBuilder<TEntity>(this.mapper, this.connection)
			.forEntity(entity);
	}
}