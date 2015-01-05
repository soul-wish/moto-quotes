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
        template: _.template("<%= title %>"),
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
            "click .submit": "createQuote"
        },
        initialize: function() {
            console.log('INIT');
            this.quote = this.$('.quote');
            this.quoteInput = this.$('.quote-input');
            this.secretWordInput = this.$('.secret-word-input');
        },
        createQuote: function(e) {
            e.preventDefault();

            console.log('CREATE');
            if (!this.quoteInput.val() || !this.secretWordInput.val() || this.secretWordInput.val() !== 'motofamily') { return; }

            this.collection.create({
                quote: this.quoteInput.val(),
                time: new Date()
            });
        }
    });

    col = collection = new QuoteCollection();
    qa = app = new QuotesAppView({collection: collection});
});