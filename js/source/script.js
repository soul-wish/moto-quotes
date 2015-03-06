$(document).ready(function(){
    var addQuoteBtn = $('.add-quote'),
        addQuoteForm = $('.quote-block'),
        reloadQuoteBtn = $('.reload'),
        Quote,
        QuoteCollection,
        QuoteView,
        QuotesAppView,
        collection,
        app;

    addQuoteBtn.on('click', function(e) {
        e.preventDefault();

        $(this).toggleClass('add-quote_active');
        addQuoteForm.toggle(300);
    });
    
    Quote = Backbone.Model.extend();

    QuoteCollection = Backbone.Firebase.Collection.extend({
        model: Quote,
        url: "https://motoquotes.firebaseio.com"
    });

    QuoteView = Backbone.View.extend({
        tagName: 'pre',
        template: _.template("<%= quote %>"),
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    QuotesAppView = Backbone.View.extend({
        el: $('.quotes-app'),
        events: {
            "click .submit": "createQuote",
            "click .reload": "showQuote",
            "click .prev-quote": "showAnotherQuote",
            "click .next-quote": "showAnotherQuote"
        },
        initialize: function() {
            this.quote = this.$('.quote');
            this.quoteInput = this.$('.quote-input');
            this.authorInput = this.$('.author-input');
            this.secretWordInput = this.$('.secret-word-input');
        },
        createQuote: function(e) {
            e.preventDefault();

            var date = new Date();

            if (!this.quoteInput.val() || !this.secretWordInput.val() || this.secretWordInput.val() !== 'motofamily') { 
                addQuoteBtn.trigger('click');
                return;
            }

            this.collection.create({
                quote: this.quoteInput.val(),
                author: this.authorInput.val(),
                likes: 0,
                date: date.toString()
            });
            addQuoteBtn.trigger('click');
        },
        showRandomQuote: function() {
            if (this.collection.length === 0) { return; }
            var randomModelIndex = _.random(0, this.collection.length-1);
            var randomModel = this.collection.at(randomModelIndex);

            var view = new QuoteView({model: randomModel});
            this.quote.html(view.render().el);
        },
        showQuote: function() {
            if (this.collection.length === 0) { return; }
            var view = new QuoteView({model: this.collection.at(0)});
            localStorage.setItem('index', 0);
            this.quote.html(view.render().el);
        },
        showAnotherQuote: function(e) {
            e.preventDefault();
            if (this.collection.length === 0) { return; }
            var view,
                direction = $(e.currentTarget).data('direction');
                modelIndex = parseInt(localStorage.getItem('index'));

            modelIndex = (direction === 'next') ? modelIndex + 1 : modelIndex - 1;

            if (modelIndex === -1) {
                view = new QuoteView({model: this.collection.at(this.collection.length-1)});
                localStorage.setItem('index', this.collection.length-1);
                this.quote.html(view.render().el);
            } else if (modelIndex === this.collection.length) {
                this.showQuote();
            } else {
                view = new QuoteView({model: this.collection.at(modelIndex)});
                localStorage.setItem('index', modelIndex);
                this.quote.html(view.render().el);
            }
        }
    });

    collection = new QuoteCollection();
    app = new QuotesAppView({collection: collection});
    collection.on('sync', function() {
        app.showQuote();
    });
});