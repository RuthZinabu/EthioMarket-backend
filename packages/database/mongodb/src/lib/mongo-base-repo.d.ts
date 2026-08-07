import mongoose, { Document, Model, PopulateOptions, FlattenMaps, UpdateWriteOpResult, ClientSession, SortOrder } from "mongoose";
type FilterQuery<T> = mongoose.FilterQuery<T>;
type ProjectionFields<T> = mongoose.ProjectionFields<T>;
type QueryOptions<T = any> = mongoose.QueryOptions<T>;
type UpdateQuery<T> = mongoose.UpdateQuery<T>;
type PaginationOptions = {
    skip: number;
    limit: number;
};
type SortOptionObject<T> = Record<keyof T | string, SortOrder>;
export default class MongooseBaseRepository<T extends Document> {
    private model;
    constructor(model: Model<T>);
    /**
     * Create a new document.
     *
     * @param data Data for the document to create
     * @param session mongo session
     * @returns Promise that resolves with the created document
     */
    create(data: Partial<T>, session?: ClientSession): Promise<T | null>;
    /**
     * Bulk insert documents.
     *
     * @param data Array of documents to insert
     * @param session Optional mongo session
     * @returns Promise that resolves with the created documents
     */
    bulkInsert(data: Partial<T>[], session?: ClientSession): Promise<Document[] | null>;
    /**
     * Find a document.
     *
     * @param query Query object
     * @param options Mongoose query options
     * @param population Population options array
     * @param returnedFields Fields to return (projection)
     * @param sort sorting options
     * @returns Promise that resolves with the fetched document
     */
    findOne(query: FilterQuery<T>, options?: QueryOptions, population?: PopulateOptions[], returnedFields?: ProjectionFields<T>, sort?: SortOptionObject<T>): Promise<FlattenMaps<T> | null>;
    /**
     * Update a document.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options (e.g. new, runValidators, etc.)
     * @param session mongo session
     * @returns Promise that resolves with the updated document
     */
    updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>, options?: QueryOptions, session?: ClientSession): Promise<FlattenMaps<T> | null>;
    /**
     * Update a document and return the updated document.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options (e.g. runValidators, etc.)
     * @param session mongo session
     * @returns Promise that resolves with the updated document
     */
    findOneAndUpdate(query: FilterQuery<T>, updates: UpdateQuery<T>, options?: QueryOptions, session?: ClientSession): Promise<FlattenMaps<T> | null>;
    /**
     * Update multiple documents.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options
     * @returns Promise that resolves with the update result
     */
    updateMany(query: FilterQuery<T>, updates: UpdateQuery<T>, options?: QueryOptions): Promise<UpdateWriteOpResult>;
    /**
     * Delete a document.
     *
     * @param query Query object
     * @param options Mongoose query options
     * @returns Promise that resolves with the deleted document
     */
    deleteOne(query: FilterQuery<T>, options?: QueryOptions): Promise<FlattenMaps<T> | null>;
    /**
     * remove a document.
     *
     * @param query Query object
     * @returns Promise that resolves with the deleted totally remove the document document
     */
    removeOne(query: FilterQuery<T>): Promise<FlattenMaps<T> | null>;
    /**
     * Get all documents.
     *
     * @param query Query object
     * @param options Mongoose query options
     * @param population Population options array
     * @param returnedFields Fields to return (projection)
     * @param sort sorting options
     * @param limit for limiting data
     * @returns Promise that resolves with the list of documents
     */
    find(query: FilterQuery<T>, options?: QueryOptions, population?: PopulateOptions[], returnedFields?: ProjectionFields<T>, sort?: SortOptionObject<T>, limit?: number): Promise<FlattenMaps<T>[] | null>;
    /**
     * Get paginated documents.
     *
     * @param query Query object
     * @param pagination Pagination options (skip & limit)
     * @param options Mongoose query options
     * @param population Population options array
     * @param returnedFields Fields to return (projection)
     * @param sort sorting options
     * @returns Promise that resolves with total count and paginated documents
     */
    getPaginated(query: FilterQuery<T>, pagination: PaginationOptions, options?: QueryOptions, population?: PopulateOptions[], returnedFields?: ProjectionFields<T>, sort?: SortOptionObject<T>): Promise<{
        total: number;
        docs: FlattenMaps<T>[];
    }>;
    /**
     * Perform a bulkWrite operation.
     *
     * @param operations List of bulkWrite operations
     * @returns Result of bulkWrite
     */
    bulk(operations: Parameters<Model<T>["bulkWrite"]>[0], session?: ClientSession): Promise<ReturnType<Model<T>["bulkWrite"]>>;
    /**
     * Count documents that match a query.
     *
     * @param query   MongoDB filter
     * @returns       Promise that resolves with the number of matching documents
     */
    countDocuments(query: FilterQuery<T>): Promise<number>;
}
export {};
//# sourceMappingURL=mongo-base-repo.d.ts.map