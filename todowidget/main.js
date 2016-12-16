(function( window ) {

 // require widget css
    $('head').append($("<link/>", {
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css", 
        crossorigin: "anonymous" 
    }));
    $('head').append($("<link/>", {
        rel: "stylesheet",
        href: "todowidget/css/styles.css"
    }));

// create widget constructor
    function TodoWidget(title, container) {	
    // initialize widget
        var widget = this;
        widget.container = $(container);
        widget.storageName = container.replace('.', '').replace('#', '');
        widget.wigetTpl = $.parseHTML(widget.tpl.wigetTpl(title));
        widget.newTask = $(widget.wigetTpl).find(widget.helpers.WIDGET_SELECTORS.ADD_INPUT_TASK_SELECTOR);
        widget.addTask = $(widget.wigetTpl).find(widget.helpers.WIDGET_SELECTORS.ADD_BUTTON_TASK_SELECTOR);
        widget.taskList = $(widget.wigetTpl).find(widget.helpers.WIDGET_SELECTORS.LIST_TASKS_SELECTOR);
        widget.showEmplty = $(widget.wigetTpl).find(widget.helpers.WIDGET_SELECTORS.SHOW_EMPTY_SELECTOR);

        widget.init = function(){
            widget.storageInit();
            widget.container.append(widget.wigetTpl);
            widget.newTask.on("focus keydown", widget.handleFocusInput);
            widget.newTask.on("keyup", widget.handleAddTask);
            widget.addTask.on("click", widget.handleAddTask);
            widget.taskList.find(widget.helpers.WIDGET_SELECTORS.REMOVE_TASKS_SELECTOR).on("click", widget.handleRemoveTask);
         };

     // add task methods
        widget.handleAddTask = function(e) {
            if ($(this).prop("tagName").toLowerCase() === widget.helpers.WIDGET_SELECTORS.ADD_INPUT_TASK_SELECTOR && e.keyCode !== 13) {                
                return;
            }

            var task_desc = widget.newTask.val();
            if (task_desc.length === 0) {
                widget.handleShowEmpty(widget.helpers.HAS_ERROR_CLASS.ADD);
                return;
            } else {
                widget.handleShowEmpty(widget.helpers.HAS_ERROR_CLASS.REMOVE);                
                widget.taskList.append($.parseHTML(widget.tpl.todoTpl(task_desc)));                
                widget.newTask.val('');
                widget.taskList.find(widget.helpers.WIDGET_SELECTORS.LAST_TASK_SELECTOR).attr("data-id", widget.storageAddTodo(task_desc));
                widget.taskList.find(widget.helpers.WIDGET_SELECTORS.REMOVE_TASK_SELECTOR).on("click", widget.handleRemoveTask);               
            }
        };
     // remove task methods
        widget.handleRemoveTask = function() {            
            widget.storageRemoveTodo($(this).parent().attr("data-id"));
            $(this).parent().remove();
        };
     // set has-error class      
        widget.handleFocusInput = function() {
            widget.handleShowEmpty(widget.helpers.HAS_ERROR_CLASS.REMOVE);
        };
     // manage has-error class
        widget.handleShowEmpty = function(flag) {
            if (flag === widget.helpers.HAS_ERROR_CLASS.ADD) {
                widget.showEmplty.addClass("has-error");
            } else {
                widget.showEmplty.removeClass("has-error");
            }
        };
    }

    TodoWidget.prototype.helpers = {
     // widget selectors
        WIDGET_SELECTORS: {
            ADD_INPUT_TASK_SELECTOR: 'input',
            ADD_BUTTON_TASK_SELECTOR: '#add-task',
            LIST_TASKS_SELECTOR: '#todos-list',
            LAST_TASK_SELECTOR: 'li:last-child',
            REMOVE_TASK_SELECTOR: 'li:last-child .remove-task',        
            REMOVE_TASKS_SELECTOR: '.remove-task',
            SHOW_EMPTY_SELECTOR: '.form-group',
        },
     // msg-error-class actions
        HAS_ERROR_CLASS: {
            ADD: 'add',
            REMOVE: 'remove'
        }
    };
    
    TodoWidget.prototype.tpl = {
     // functions for creating widget templates
        wigetTpl: function(title) {
            return [
                '<div class="container">',
                '<div class="row">',
                '<div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">',
                '<div class="todos">',
                '<h1 id="todos-header">' + title + '</h1>',
                '<div class="row todos-new">',
                '<div id="div-new-task" class="col-xs-8 col-sm-8 col-md-8">',
                '<div class="form-group">',
                '<input id="new-task" class="form-control" type="text" placeholder="Add todo-task">',
                '</div>',            
                '</div>',
                '<div id="div-add-task" class="col-xs-4 col-sm-4 col-md-4">',
                '<button id="add-task" class="btn btn-success form-control" type="button">Add task</button>',
                '</div>',
                '</div>',
                '<ul id="todos-list" class="list-unstyled">',
                '</ul>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
            ].join('');
        },
        todoTpl: function(desc) {
            return [
                '<li class="todo-task">',
                '<span class="todo-desc">' + desc + '</span>',
                '<button class="remove-task btn btn-default btn-xs pull-right">',
                '<span class="glyphicon glyphicon-remove"></span>',
                '</button>',
                '</li>'
            ].join('');
        }
    };

 // methods for work with localStorage
    TodoWidget.prototype.storageInit = function() {
        if (localStorage.getItem(this.storageName) === null) {
            localStorage.setItem(this.storageName, JSON.stringify({}));
        } else {
            var widget = this;
            $.each( JSON.parse(localStorage.getItem(widget.storageName)), function( key, value ) {
                widget.taskList.append($.parseHTML(widget.tpl.todoTpl(value)));
                widget.taskList.find(widget.helpers.WIDGET_SELECTORS.LAST_TASK_SELECTOR).attr("data-id", key);
            });
        }
    };
    TodoWidget.prototype.storageAddTodo = function(todo) {
        var todos = JSON.parse(localStorage.getItem(this.storageName)),
            todosKeys = Object.keys(todos);
            newKey = (todosKeys.length === 0) ? 0 : Math.max.apply(Math, todosKeys) + 1;
        localStorage.setItem(this.storageName, JSON.stringify( Object.assign(todos, {[newKey] : todo })));

        return newKey;
    };
    TodoWidget.prototype.storageRemoveTodo = function(todo) {
        var todos = JSON.parse(localStorage.getItem(this.storageName));
        delete todos[todo];
        localStorage.setItem(this.storageName, JSON.stringify(todos));
    }; 


    window.TodoWidget = window.TodoWidget || TodoWidget;

})(window);