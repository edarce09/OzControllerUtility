'use strict'

let response = require('/home/kirsch/Repository/jsRepos/myNpmDependencies/responses');

const exportControllers = function importsAndReturnController(model, options){
  // options structure
  // {populate, ignore, sort}
  let sort = options.sort
    ? options.sort
    : "name";
  let populate = options.populate
    ? options.populate
    :""
  let params = {
    options:{
      sort:sort,
      populate:populate
    } 
  }

  const createOne = function createsNewDocument(req, res){
    let newDocument = new model();
    newDocument.preEdit(req.body, (err)=>{
      if(err) return response.serverError(res, {}, err);
      newDocument.save((err)=>{
        if(err){
          if(err.code === 11000) return response.duplicated(res, err);
          return response.serverError(res, {}, err);
        }
        return response.ok(res, newDocument);
      });
    });
  }

  const getOne = function loadOneDocument(req, res){
    //utils.buildQuery
    let query= JSON.parse("{"+req.params.doc+"}");
    //let docToRead = JSON.parse("{"+req.params.doc+"}");
    //let query = docToRead;
    /*let query = (docToRead._id !== undefined)
      ? {_id:docToRead._id}
      : {name:docToRead.name};
      */
    let params = {query:query, populate:populate};
    model.load(params, (err, doc)=>{
      if(err) return response.serverError(res, doc, err);
      if(!doc) return response.notFound(res);
      else return response.ok(res, doc);
    });
  }

  const getAll = function loadAllDocuments(req, res){
    model.loadAll(params, (err, documents)=>{
      if(err) return response.serverError(res, roles, err);
      if(!documents) return response.notFound(res);
      else return response.ok(res, documents);
    });
  }

  const editOne= function editOneDocument(req, res){
    let query= JSON.parse("{"+req.params.doc+"}");
    let params = {query:query};
    model.load(params, (err, doc)=>{
      if(err) return response.serverError(res, doc, err);
      if(!doc) return response.notFound(res);
      doc.preEdit(req.body, (err)=>{
        if(err) return response.serverError(res, doc, err);
        console.log(doc);
        doc.save((err)=>{
          if(err) return response.serverError(res, doc, err);
          else return response.ok(res, doc);
        });
      });
    });
  }

  const deleteOne = function deleteOneDocument(req, res){
    let query= JSON.parse("{"+req.params.doc+"}");
    let params = {query:query};
    model.deleteOne(params, (err)=>{
      if(err) return response.serverError(res, {}, err);
      return response.ok(res);
    });
  }

  const disableIt = function disableDocument(req, res){
    let query= JSON.parse("{"+req.params.doc+"}");
    let params = {query:query};
    model.load(params, (err, doc)=>{
      if(err) return response.serverError(res, doc, err);
      if(!doc) return response.notFound(res);
      doc.setEnabled((err)=>{
        if(err) return response.serverError(res, doc, err);
        return response.ok(res);
      });
    });
  }

 return {
   createOne,
   getOne,
   getAll,
   editOne,
   deleteOne,
   disableIt
 }
}

module.exports = {
  exportControllers
}
