tui.util.defineNamespace("fedoc.content", {});
fedoc.content["manager_data.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Data is kind of manager module to request data at API with input queries.\n * @author NHN Entertainment FE dev team. &lt;dl_javascript@nhnent.com>\n */\n'use strict';\n\nvar CALLBACK_NAME = 'dataCallback',\n    SERACH_QUERY_IDENTIFIER = 'q';\n\nvar forEach = tui.util.forEach,\n    map = tui.util.map,\n    isEmpty = tui.util.isEmpty,\n    extend = tui.util.extend;\n\n/**\n * Unit of auto complete connecting server.\n * @constructor\n */\nvar Data = tui.util.defineClass(/**@lends Data.prototype */{\n    init: function(autoCompleteObj, options) {\n        this.autoCompleteObj = autoCompleteObj;\n        this.options = options;\n    },\n\n    /**\n     * Request data at api server use jsonp\n     * @param {String} keyword String to request at server\n     */\n    request: function(keyword) {\n        var rsKeyWrod = keyword.replace(/\\s/g, ''),\n            acObj = this.autoCompleteObj,\n            keyData;\n\n        if (!keyword || !rsKeyWrod) {\n            acObj.hideResultList();\n            return;\n        }\n\n        this.options.searchApi[SERACH_QUERY_IDENTIFIER] = keyword;\n        $.ajax(this.options.searchUrl, {\n            'dataType': 'jsonp',\n            'jsonpCallback': CALLBACK_NAME,\n            'data': this.options.searchApi,\n            'type': 'get',\n            'success': $.proxy(function(dataObj) {\n                try {\n                    keyData = this._getCollectionData(dataObj);\n                    acObj.setQueries(dataObj.query);\n                    acObj.setServerData(keyData);\n                    acObj.clearReadyValue();\n                } catch (e) {\n                    throw new Error('[DataManager] invalid response data.', e);\n                }\n            }, this)\n        });\n    },\n\n    /**\n     * Make collection data to display\n     * @param {object} dataObj Collection data\n     * @returns {Array}\n     * @private\n     */\n    _getCollectionData: function(dataObj) {\n        var collection = dataObj.collections,\n            itemDataList = [];\n\n        forEach(collection, function(itemSet) {\n            var keys;\n\n            if (isEmpty(itemSet.items)) {\n                return;\n            }\n\n            keys = this._getRedirectData(itemSet);\n            itemDataList.push({\n                type: 'title',\n                values: [itemSet.title]\n            });\n            itemDataList = itemDataList.concat(keys);\n        }, this);\n\n        return itemDataList;\n    },\n\n    /**\n     * Make item of collection to display\n     * @param {object} itemSet Item of collection data\n     * @private\n     * @returns {Array}\n     */\n    _getRedirectData: function(itemSet) {\n        var defaultData = {\n                type: itemSet.type,\n                index: itemSet.index,\n                dest: itemSet.destination\n            },\n            items = itemSet.items.slice(0, this.options.viewCount - 1);\n\n        items = map(items, function(item) {\n            return extend({\n                values: item\n            }, defaultData);\n        });\n\n        return items;\n    }\n});\n\nmodule.exports = Data;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"