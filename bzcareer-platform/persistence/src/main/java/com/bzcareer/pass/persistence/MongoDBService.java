package com.bzcareer.pass.persistence;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.bson.Document;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

public class MongoDBService {

	public SearchResults query(String keyword, String local, int num) {
		SearchResults results = new SearchResults();
		int count = 0;
	MongoCollection<Document> collection = DriverWrapper.connect(
				"ResultsIndexCanada", "FinishedJobsIndexed");
		Map<String, Integer> sideCompany = new HashMap<String, Integer>();
		Map<String, Integer> sideJType = new HashMap<String, Integer>();
		if (isValid(keyword) && isRealLocation(local)) {
 				FindIterable<Document> find = collection.find();
				for (Document document : find) {
					DriverWrapper.addUnique(sideCompany, document
							.get("CompanyName").toString());
					DriverWrapper.addUnique(sideJType, document.get("JobType")
							.toString());
					Job job = initJob(document);
					// TODO: do threading logic to make this run faster then 15-30
					// seconds.
					results.addJob(job);
					count++;
				}
			Sidebar sidebar = new Sidebar();
			sidebar.setCompanies(sideCompany);
			sidebar.setJobType(sideJType);
			results.setSideBar(sidebar);
			results.setTotalJobs(count);
			results.setTotalPages(pageCalculator(count));
		}
		return results;
	}

	private static int pageCalculator(int count) {
		int pages;
		if (count % 10 != 0) {
			pages = (count / 10) + 1;
		} else {
			pages = count / 10;
		}
		return pages;
	}

	private Job initJob(Document document) {
		Job job = new Job();

		if (document.keySet().contains("CompanyName")) {
			job.setCompanyName(document.get("CompanyName").toString());
		}
		if (document.keySet().contains("JobDate")) {
			job.setJobDate(document.get("JobDate").toString());
		}
		if (document.keySet().contains("JobDetails")) {
			String jdescribe = document.get("JobDetails").toString();
			if (jdescribe.length() < 120) {
				job.setJobDetails(document.get("JobDetails").toString());
			} else {
				job.setJobDetails(document.get("JobDetails").toString()
						.substring(0, 120)
						+ "...");
			}
		}
		if (document.keySet().contains("JobDetailURL")) {
			job.setJobDetailURL(document.get("JobDetailURL").toString());
		}
		if (document.keySet().contains("JobID1")) {
			job.setJobID1(document.get("JobID1").toString());
		}
		if (document.keySet().contains("JobLocation")) {
			job.setJobLocation(document.get("JobLocation").toString());
		}
		if (document.keySet().contains("JobTitle")) {
			job.setJobTitle(document.get("JobTitle").toString());
		}
		if (document.keySet().contains("JobType")) {
			job.setJobType(document.get("JobType").toString());
		}
		return job;
	}

	private boolean isRealLocation(String local) {
		// TODO Check database to confirm that the location exists in Canada.
		// They may use a city or a province.
		// Check for null
		return true;
	}

	private boolean isValid(String keyword) {
		// TODO Make sure the the keyword is not undefined or null ...
		// TODO Check for null ...
		// TODO Also check if this is a synonyms of the word ...
		return true;
	}

	public SearchResults queryByCompany(String company, String role,
			String location, int page) {
		// TODO: When queries come in this is a result of 'company:*' in the
		// query string keyword param.
		return new SearchResults();
	}

	public SearchResults queryByJobType(String jobType, String role,
			String location, int page) {
		// TODO: When queries come in this is a result of 'company:*' in the
		// query string keyword param.
		return new SearchResults();
	}

	public List<String> queryAutocomplete(String starts_with, String country) {

		MongoCollection<Document> cities = null;
		// TODO: Need to pull keywords from CAUrlDB.newCanadaMap.find({city:''})
		if (country.equalsIgnoreCase("Canada")) {
			cities = DriverWrapper.connect("CAUrlDB", "newCanadaMap");
		} else if (country.equalsIgnoreCase("US")) {
			cities = DriverWrapper.connect("USAUrlDB", "newUSAMap");
		}
		BasicDBObject q = new BasicDBObject();
		q.put("City", Pattern.compile(starts_with));
		cities.find(q);
		return new ArrayList<String>();
	}

}
