"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class MongooseBaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    /**
     * Create a new document.
     *
     * @param data Data for the document to create
     * @param session mongo session
     * @returns Promise that resolves with the created document
     */
    async create(data, session) {
        logger_1.logger.info("creating a new document in " + this.model.modelName);
        try {
            const document = new this.model(data);
            await document.save({ session });
            return document;
        }
        catch (error) {
            logger_1.logger.error(`Error creating document in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Bulk insert documents.
     *
     * @param data Array of documents to insert
     * @param session Optional mongo session
     * @returns Promise that resolves with the created documents
     */
    async bulkInsert(data, session) {
        logger_1.logger.info("bulk inserting documents in " + this.model.modelName);
        try {
            const documents = await this.model.insertMany(data, { session });
            return documents;
        }
        catch (error) {
            logger_1.logger.error(`Error bulk inserting documents in ${this.model.modelName}`, error);
            throw error;
        }
    }
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
    async findOne(query, options, population, returnedFields, sort) {
        logger_1.logger.info("finding document in " + this.model.modelName);
        try {
            let documentQuery = this.model
                .findOne(query, returnedFields, options)
                .sort(sort ?? { createdAt: -1 })
                .lean();
            if (population) {
                documentQuery = documentQuery.populate(population);
            }
            const document = await documentQuery;
            return document;
        }
        catch (error) {
            logger_1.logger.error(`Error finding document in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Update a document.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options (e.g. new, runValidators, etc.)
     * @param session mongo session
     * @returns Promise that resolves with the updated document
     */
    async updateOne(query, updates, options, session) {
        logger_1.logger.info("updating document in " + this.model.modelName);
        // Merge user options with { new: true } to return the updated document.
        const optionsMod = {
            ...options,
            new: true,
            session,
        };
        try {
            const document = await this.model
                .findOneAndUpdate(query, updates, optionsMod)
                .lean();
            return document;
        }
        catch (error) {
            logger_1.logger.error(`Error updating document in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Update a document and return the updated document.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options (e.g. runValidators, etc.)
     * @param session mongo session
     * @returns Promise that resolves with the updated document
     */
    async findOneAndUpdate(query, updates, options, session) {
        logger_1.logger.info("finding and updating document in " + this.model.modelName);
        try {
            const result = await this.model
                .findOneAndUpdate(query, updates, {
                ...options,
                new: true, // return updated document
                session,
            })
                .lean();
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Error findOneAndUpdate document in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Update multiple documents.
     *
     * @param query Query object
     * @param updates Update data
     * @param options Mongoose update options
     * @returns Promise that resolves with the update result
     */
    async updateMany(query, updates, options) {
        logger_1.logger.info("updating documents in " + this.model.modelName);
        //WE HAVE TO SANITIZE THE SESSION EITHER IS SHOULD BE UNDEFINED OR VALID SESSION
        const sanitizedOptions = options
            ? {
                ...options,
                session: options.session === null ? undefined : options.session,
            }
            : {};
        try {
            const result = await this.model.updateMany(query, updates, sanitizedOptions);
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Error updating documents in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Delete a document.
     *
     * @param query Query object
     * @param options Mongoose query options
     * @returns Promise that resolves with the deleted document
     */
    async deleteOne(query, options) {
        logger_1.logger.info("deleting document in " + this.model.modelName);
        try {
            const document = await this.model
                .findOneAndUpdate(query, { $set: { isDeleted: true } }, options)
                .sort({ _id: -1 })
                .select("-__v")
                .lean();
            return document;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting document in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * remove a document.
     *
     * @param query Query object
     * @returns Promise that resolves with the deleted totally remove the document document
     */
    async removeOne(query) {
        logger_1.logger.info("deleting document in " + this.model.modelName);
        try {
            const document = await this.model
                .deleteOne(query)
                .sort({ _id: -1 })
                .select("-__v")
                .lean();
            return document;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting document in ${this.model.modelName}`, error);
            throw error;
        }
    }
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
    async find(query, options, population, returnedFields, sort, limit) {
        logger_1.logger.info("finding documents in " + this.model.modelName);
        try {
            const queryBuilder = this.model.find(query, returnedFields, options);
            if (population) {
                queryBuilder.populate(population);
            }
            if (limit) {
                queryBuilder.limit(limit);
            }
            if (sort) {
                queryBuilder.sort(sort);
            }
            else {
                queryBuilder.sort({ _id: -1 }); //sort by created at latest
            }
            const docs = await queryBuilder.lean();
            return docs;
        }
        catch (error) {
            logger_1.logger.error(`Error getting documents in ${this.model.modelName}`, error);
            throw error;
        }
    }
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
    async getPaginated(query, pagination, options, population, returnedFields, sort) {
        logger_1.logger.info("finding paginated documents in " + this.model.modelName);
        try {
            const total = await this.model.countDocuments(query);
            const queryBuilder = this.model.find(query, returnedFields, options);
            if (population) {
                queryBuilder.populate(population);
            }
            if (sort) {
                queryBuilder.sort(sort);
            }
            else {
                queryBuilder.sort({ _id: -1 }); //sort by created at latest
            }
            queryBuilder.limit(pagination.limit).skip(pagination.skip);
            const docs = await queryBuilder.lean();
            return { total, docs };
        }
        catch (error) {
            logger_1.logger.error(`Error getting paginated documents in ${this.model.modelName}`, error);
            return { total: 0, docs: [] };
        }
    }
    /**
     * Perform a bulkWrite operation.
     *
     * @param operations List of bulkWrite operations
     * @returns Result of bulkWrite
     */
    async bulk(operations, session) {
        logger_1.logger.info("performing bulkWrite in " + this.model.modelName);
        try {
            const result = await this.model.bulkWrite(operations, { session });
            return result;
        }
        catch (error) {
            logger_1.logger.error(`Error performing bulkWrite in ${this.model.modelName}`, error);
            throw error;
        }
    }
    /**
     * Count documents that match a query.
     *
     * @param query   MongoDB filter
     * @returns       Promise that resolves with the number of matching documents
     */
    async countDocuments(query) {
        logger_1.logger.info("counting documents in " + this.model.modelName);
        try {
            const count = await this.model.countDocuments(query);
            return count;
        }
        catch (error) {
            logger_1.logger.error(`Error counting documents in ${this.model.modelName}`, error);
            throw error;
        }
    }
}
exports.default = MongooseBaseRepository;
//# sourceMappingURL=mongo-base-repo.js.map