import chalk from 'chalk';
import config from '../../../../config/config.json' with { type: 'json' };

class LoggerService {
	public http(message: string) {
		console.log(chalk.bgMagentaBright(chalk.black('http')) + '	' + message);
	}
	public debug(message: string) {
		if (config.debug === 'true')
			console.log(
				chalk.bgCyanBright(chalk.black('debug')) + '	' + message
			);
	}
	public done(message: string) {
		console.log(chalk.bgGreenBright(chalk.black('done')) + '	' + message);
	}
	public info(message: string) {
		console.log(chalk.bgBlueBright(chalk.black('info')) + '	' + message);
	}
	public warn(message: string) {
		console.log(chalk.bgYellowBright(chalk.black('warn')) + '	' + message);
	}
	public error(message: string) {
		console.log(chalk.bgRedBright(chalk.black('error')) + '	' + message);
	}
}

export default new LoggerService();
