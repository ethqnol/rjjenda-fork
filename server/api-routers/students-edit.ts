import * as bodyParser from 'body-parser'
import * as express from 'express'
import {Students, StudentUpdate} from '../../api'
import {error, success} from '../api-respond'
import {Student, Teacher} from '../models'

const router = express.Router()
router.get('/students', (_, res) => {
	Student.findAll({
		attributes: ['id', 'firstName', 'lastName', 'username', 'year'],
		include: [{
			model: Teacher,
			attributes: ['lastName'],
			as: 'advisor'
		}],
		order: [
			['lastName', 'ASC'],
			['firstName', 'ASC']
		]
	})
		.then(students => {
			const response: Students = students.map(({id, firstName, lastName, username, year, advisor}) => {
				return {
					id,
					firstName,
					lastName,
					username,
					year,
					advisor: advisor === null ? '' : advisor.lastName
				}
			})
			success(res, response)
		})
		.catch(err => error(res, err))
})
interface IdParams {
	id: string
}
router.delete('/student/:id', (req, res) => {
	const {id} = req.params as IdParams
	Student.destroy({
		where: {id}
	})
		.then(() => success(res))
		.catch(err => error(res, err))
})
router.post('/student/:id/update',
	bodyParser.json(),
	(req, res) => {
		const {id} = req.params as IdParams
		const {attribute, value} = req.body as StudentUpdate
		Student.findOne({
			attributes: ['id'],
			where: {id}
		})
			.then(student => {
				if (student === null) throw new Error('No such student id: ' + id)
				return student
					.set(attribute, value)
					.save()
			})
			.then(() => success(res))
			.catch(err => error(res, err))
	}
)
router.get('/student/set-advisor/:id/:advisorId', (req, res) => {
	const {id, advisorId} = req.params as {[param: string]: string}
	Student.findOne({
		attributes: ['id'],
		where: {id}
	})
		.then(student => {
			if (student === null) throw new Error('No such student id: ' + id)
			student.set('advisorId', advisorId)
			return student.save()
		})
		.then(() => success(res))
		.catch(err => error(res, err))
})

export default router