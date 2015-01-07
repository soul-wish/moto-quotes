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
        tagName: 'span',
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
            "click .reload": "showQuote"
        },
        initialize: function() {
            var self = this;
            this.quote = this.$('.quote');
            this.quoteInput = this.$('.quote-input');
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
                date: date.toString()
            });
            addQuoteBtn.trigger('click');
        },
        showQuote: function() {
            if (this.collection.length === 0) { return; }
            var randomModelIndex = _.random(0, this.collection.length-1);
            randomModel = this.collection.at(randomModelIndex);

            var view = new QuoteView({model: randomModel});
            this.quote.html(view.render().el);
        }
    });

    collection = new QuoteCollection();
    app = new QuotesAppView({collection: collection});
    collection.on('sync', function() {
        app.showQuote();
    });
});