const db = require('../db/index');
const writerDB = require('../db/writer');
const { perPage } = require('../config.js');

module.exports = {
	async getVideos(args) {
		try {
			const page = args.page - 1 || 0;
			const skip = page * perPage;
			const order = {
				toSqlString() {
					return args.order || 'DESC';
				},
			};

			let sql;
			const bindings = [args.publisher_id, order, perPage, skip];

			switch (args.recommendable_filter) {
			case 'RECOMMENDABLE':
				sql = `
						SELECT trc.videos.*, trc.publishers.name as publisher 
						FROM trc.videos 
						INNER JOIN trc.publishers 
						ON trc.publishers.id = trc.videos.publisher_id 
						WHERE publisher_id = ? 
						AND is_recommendable = true
						AND has_expired = false
						ORDER BY create_time ?
						LIMIT ?
						OFFSET ?
					`;
				break;

			case 'NON_RECOMMENDABLE':
				sql = `
						SELECT trc.videos.*, trc.publishers.name as publisher 
						FROM trc.videos 
						INNER JOIN trc.publishers 
						ON trc.publishers.id = trc.videos.publisher_id 
						WHERE publisher_id = ? 
						AND (is_recommendable = false
						OR has_expired = true)
						ORDER BY create_time ?
						LIMIT ?
						OFFSET ?
					`;
				break;

			default:
				sql = `
						SELECT trc.videos.*, trc.publishers.name as publisher 
						FROM trc.videos 
						INNER JOIN trc.publishers 
						ON trc.publishers.id = trc.videos.publisher_id 
						WHERE publisher_id = ? 
						ORDER BY create_time ?
						LIMIT ?
						OFFSET ?
					`;
			}

			const videos = await db.query(sql, bindings);

			if (videos.fatal) throw new Error('PubCrawlDB response failed');

			return videos;
		} catch (error) {
			return error;
		}
	},

	async getCrawlerAuditData(pubName, ids) {
		try {
			const placeholders = ids.map(() => '?').join();
			const auditData = await db.query(
				`
						SELECT * FROM crawler.audit 
						WHERE publisher = ?
						AND pub_item_id IN (${placeholders})
					`,
				[pubName, ...ids],
			);

			if (auditData.fatal) throw new Error('PubCrawlDB response failed');

			return auditData;
		} catch (error) {
			return error;
		}
	},

	async getCrawlerInstructionsData(pubName, ids) {
		try {
			const placeholders = ids.map(() => '?').join();
			const instructionsData = await db.query(
				`
						SELECT * FROM crawler.instructions 
						WHERE publisher = ?
						AND pub_item_id IN (${placeholders})
					`,
				[pubName, ...ids],
			);

			if (instructionsData.fatal) throw new Error('PubCrawlDB response failed');

			return instructionsData;
		} catch (error) {
			return error;
		}
	},

	async getPageInfo({ publisher_id, recommendable_filter }) {
		try {
			let sql;

			switch (recommendable_filter) {
			case 'RECOMMENDABLE':
				sql = 'SELECT COUNT(id) FROM trc.videos WHERE publisher_id = ? AND is_recommendable = true AND has_expired = false';
				break;
			case 'NON_RECOMMENDABLE':
				sql = 'SELECT COUNT(id) FROM trc.videos WHERE publisher_id = ? AND (is_recommendable = false OR has_expired = true)';
				break;
			default:
				sql = 'SELECT COUNT(id) FROM trc.videos WHERE publisher_id = ?';
			}
			const [count] = await db.query(sql, [publisher_id]);
			const videoCount = count['COUNT(id)'];
			const totalPages = Math.ceil(videoCount / perPage);

			return totalPages;
		} catch (error) {
			return error;
		}
	},

	async getChannelsData(pubId, ids) {
		try {
			const placeholders = ids.map(() => '?').join();
			const channels = await db.query(
				`
						SELECT channel.*, parent.channel as parent_channel, parent.id as parent_channel_id, trc.video_channels.* 
						FROM trc.video_channels
						JOIN trc.publisher_channels as channel 
						ON trc.video_channels.channel_id = channel.id
						LEFT JOIN trc.publisher_channels as parent
						ON channel.parent_channel = parent.id
						WHERE channel.publisher_id = ?
						AND trc.video_channels.video_id IN (${placeholders})
					`,
				[pubId, ...ids],
			);

			if (channels.fatal) throw new Error('PubCrawlDB response failed');

			return channels;
		} catch (error) {
			return error;
		}
	},

	async getMetaData(ids) {
		try {
			const placeholders = ids.map(() => '?').join();
			const metaData = await db.query(
				`SELECT * FROM trc.video_metadata WHERE video_id IN (${placeholders})`,
				[...ids],
			);

			if (metaData.fatal) throw new Error('PubCrawlDB response failed');

			return metaData;
		} catch (error) {
			return error;
		}
	},

	async recrawl(pubName, pubItemId) {
		try {
			const success = await writerDB.query(
				`UPDATE crawler.instructions
				SET instructions.next_crawl=now(), instructions.video_status=1
				WHERE publisher = ? and pub_item_id = ?;`,
				[pubName, pubItemId],
			);

			if (success.fatal) throw new Error('PubCrawlDB response failed');

			return success;
		} catch (error) {
			return error;
		}
	},
};
