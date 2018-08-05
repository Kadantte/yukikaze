const { Command } = require('discord-akairo');
const { cleanContent } = require('../../../util/cleanContent');
const { Op } = require('sequelize');

class TagShowCommand extends Command {
	constructor() {
		super('tag-show', {
			category: 'tags',
			description: {
				content: 'Displays a tag.',
				usage: '<tag>'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'name',
					match: 'content',
					type: 'lowercase'
				}
			]
		});
	}

	async exec(message, { name }) {
		if (Boolean(message.member.roles.find(r => r.name === 'Embed restricted'))) return;
		name = cleanContent(message, name);
		const tag = await this.client.db.models.tags.findOne({
			where: {
				[Op.or]: [
					{ name },
					{ aliases: { [Op.contains]: [name] } }
				],
				guild: message.guild.id
			}
		});
		if (!tag) return;
		tag.increment('uses');

		return message.util.send(tag.content);
	}
}

module.exports = TagShowCommand;
