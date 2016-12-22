(function( window ) {

    function TodoWidget(title, container) {
        var widget = this;
            widget._container = $(container);
            widget._storageName = container.replace('.', '').replace('#', '');
            widget._tpl = $.parseHTML(widget.tpl.main(title));
            widget._newTask = $(widget._tpl).find(widget.helpers.WIDGET_SELECTORS.ADD_INPUT_TASK_SELECTOR);
            widget._addTask = $(widget._tpl).find(widget.helpers.WIDGET_SELECTORS.ADD_BUTTON_TASK_SELECTOR);
            widget._taskList = $(widget._tpl).find(widget.helpers.WIDGET_SELECTORS.LIST_TASKS_SELECTOR);
            widget._showHasError = $(widget._tpl).find(widget.helpers.WIDGET_SELECTORS.SHOW_HAS_ERROR_SELECTOR);

     // add task methods
        widget._onClickAndKeyupAddTask = function(e) {
            if ($(e.target).prop("tagName").toLowerCase() === widget.helpers.WIDGET_SELECTORS.ADD_INPUT_TASK_SELECTOR && e.keyCode !== 13) {
                return;
            }

            var task_desc = widget._newTask.val();
            if (task_desc.length === 0) {
                widget._manageHasErrorClass(widget.helpers.HAS_ERROR_CLASS.ADD);
                return;
            } else {
                widget._manageHasErrorClass(widget.helpers.HAS_ERROR_CLASS.REMOVE);
                widget._taskList.append($.parseHTML(widget.tpl.todo(task_desc)));
                widget._newTask.val('');
                widget._taskList.find(widget.helpers.WIDGET_SELECTORS.LAST_TASK_SELECTOR).attr("data-id", widget.storageAddTodo(task_desc));
                widget._taskList.find(widget.helpers.WIDGET_SELECTORS.REMOVE_TASK_SELECTOR).on("click", widget._onClickRemoveTask);
            }
        };
     // remove task methods
        widget._onClickRemoveTask = function(e) {
            var el = (e.target.parentNode.className === widget.helpers.WIDGET_SELECTORS.CURRENT_TASK_CLASS) ? e.target.parentNode : e.target.parentNode.parentNode;
            widget.storageRemoveTodo($(el).attr("data-id"));
            $(el).find(widget.helpers.WIDGET_SELECTORS.REMOVE_TASKS_SELECTOR).off("click", widget._onClickRemoveTask);
            $(el).remove();
        };
     // set has-error class      
        widget._onFocusInput = function() {
            widget._manageHasErrorClass(widget.helpers.HAS_ERROR_CLASS.REMOVE);
        };
     // manage has-error class
        widget._manageHasErrorClass = function(flag) {
            if (flag === widget.helpers.HAS_ERROR_CLASS.ADD) {
                widget._showHasError.addClass("has-error");
            } else {
                widget._showHasError.removeClass("has-error");
            }
        };

     // initialize widget
        widget.storageInit();
        widget._container.append(widget._tpl);
        widget._newTask.on("focus keydown", widget._onFocusInput);
        widget._newTask.on("keyup", widget._onClickAndKeyupAddTask);
        widget._addTask.on("click", widget._onClickAndKeyupAddTask);
        widget._taskList.find(widget.helpers.WIDGET_SELECTORS.REMOVE_TASKS_SELECTOR).on("click", widget._onClickRemoveTask);
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
            SHOW_HAS_ERROR_SELECTOR: '.form-group',
            CURRENT_TASK_CLASS: 'todo-task'
        },
     // msg-error-class actions
        HAS_ERROR_CLASS: {
            ADD: 'add',
            REMOVE: 'remove'
        }
    };
    
    TodoWidget.prototype.tpl = {
     // functions for creating widget templates
        main: function(title) {
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
        todo: function(desc) {
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
        if (localStorage.getItem(this._storageName) === null) {
            localStorage.setItem(this._storageName, JSON.stringify({}));
        } else {
            var widget = this;
            $.each( JSON.parse(localStorage.getItem(widget._storageName)), function( key, value ) {
                widget._taskList.append($.parseHTML(widget.tpl.todo(value)));
                widget._taskList.find(widget.helpers.WIDGET_SELECTORS.LAST_TASK_SELECTOR).attr("data-id", key);
            });
        }
    };
    TodoWidget.prototype.storageAddTodo = function(todo) {
        var todos = JSON.parse(localStorage.getItem(this._storageName)),
            todosKeys = Object.keys(todos);
            newKey = (todosKeys.length === 0) ? 0 : Math.max.apply(Math, todosKeys) + 1;
        localStorage.setItem(this._storageName, JSON.stringify( Object.assign(todos, {[newKey] : todo })));

        return newKey;
    };
    TodoWidget.prototype.storageRemoveTodo = function(todo) {
        var todos = JSON.parse(localStorage.getItem(this._storageName));
        delete todos[todo];
        localStorage.setItem(this._storageName, JSON.stringify(todos));
    }; 


    window.TodoWidget = window.TodoWidget || TodoWidget;

})(window);