var LocalDocs = {
	"docs":{
		1:{"user":{"id":1, "name":"Иванов И.И."},
			"roots":[
				{"type":"calendar", "name":"События на 2015 год", "id":"1.1", "nodes":[{"type":"event", "name":"Репа в танке", "date":"2015-11-18", "id":"1.2"}]},
				{"type":"dataSet", "name":"Форум", "dataSetID":"docs/forum"}
			],
			"nodes":[
				{"trg":"1.2", "type":"appearance", "value":1},{"trg":"2.1", "type":"appearance", "value":1}
			]
		},
		2:{"user":{"id":2, "name":"Петров П.П."},
			"roots":[
				
			],
			"nodes":[
				{"trg":"1.2", "type":"appearance", "value":1},
				{"trg":"1.1", "type":"event", "name":"Концерт в Археологии", "date":"2015-12-12", "id":"2.1"}
			]
		},
		3:{"user":{"id":3, "name":"Сидоров С.С."},
			"roots":[
				
			],
			"nodes":[
				{"trg":"1.2", "type":"appearance", "value":-1},
				{"trg":"2.1", "type":"appearance", "value":0}
			]
		}
	},
	"docs/forum":{
		1:{"user":{"id":1, "name":"Иванов И.И"},
			"roots":[
				{"type":"forum", "name":"Звукозапись", "id":"1.1", "nodes":[
					{"type":"topic", "name":"Оборудование", "id":"1.2", "nodes":[
						{"type":"message", "date":"2015-11-22T12:00", "text":"Здесь обсуждаем вопросы закупки оборудования"},
						{"type":"message", "date":"2015-11-22T12:30", "text":"Предлагаю купить три микрофона"}
					]}
				]}
			],
			"nodes":[]
		},
		2:{"user":{"id":2, "name":"Петров П.П."},
			"roots":[],
			"nodes":[
				{"trg":"1.2", "type":"message", "date":"2015-11-22T12:10", "text":"И что мы будем покупать?"}
			]
		}
	}
};