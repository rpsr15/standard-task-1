    using Talent.Common.Contracts;
    using Talent.Common.Models;
    using Talent.Services.Profile.Domain.Contracts;
    using Talent.Services.Profile.Models.Profile;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using MongoDB.Driver;
    using MongoDB.Bson;
    using Talent.Services.Profile.Models;
    using Microsoft.AspNetCore.Http;
    using System.IO;
    using Talent.Common.Security;

    namespace Talent.Services.Profile.Domain.Services
    {
        public class ProfileService : IProfileService
        {
            private readonly IUserAppContext _userAppContext;
            IRepository<UserLanguage> _userLanguageRepository;
            IRepository<User> _userRepository;
            IRepository<Employer> _employerRepository;
            IRepository<Job> _jobRepository;
            IRepository<Recruiter> _recruiterRepository;
            IFileService _fileService;


            public ProfileService(IUserAppContext userAppContext,
                                  IRepository<UserLanguage> userLanguageRepository,
                                  IRepository<User> userRepository,
                                  IRepository<Employer> employerRepository,
                                  IRepository<Job> jobRepository,
                                  IRepository<Recruiter> recruiterRepository,
                                  IFileService fileService)
            {
                _userAppContext = userAppContext;
                _userLanguageRepository = userLanguageRepository;
                _userRepository = userRepository;
                _employerRepository = employerRepository;
                _jobRepository = jobRepository;
                _recruiterRepository = recruiterRepository;
                _fileService = fileService;
            }

            public bool AddNewLanguage(AddLanguageViewModel language)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
            {
                //Your code here;
                User user = null;
                user = (await _userRepository.GetByIdAsync(Id));

                if(user != null)
                {

                List<AddLanguageViewModel> langs = new List<AddLanguageViewModel>();
                foreach(var lang in user.Languages)
                {
                    langs.Add(new AddLanguageViewModel { Name = lang.Language, Level = lang.LanguageLevel });
                }


                List<AddSkillViewModel> skills = new List<AddSkillViewModel>();
                foreach (var skill in user.Skills)
                {
                    skills.Add(new AddSkillViewModel { Name = skill.Skill, Level = skill.ExperienceLevel });
                }

                List<ExperienceViewModel> experiences = new List<ExperienceViewModel>();
                foreach(var exp in user.Experience)
                {
                    experiences.Add(new ExperienceViewModel {
                        Id = exp.Id,
                        Company = exp.Company,
                        Position = exp.Position,
                        Responsibilities = exp.Responsibilities,
                        Start = exp.Start,
                        End = exp.End
                    });
                }




                var result = new TalentProfileViewModel
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        MiddleName = user.MiddleName,
                        LastName = user.LastName,
                        Gender = user.Gender,
                        Email = user.Email,
                        MobilePhone = user.MobilePhone,
                        Phone = user.Phone,
                        Address = user.Address,
                        Nationality = user.Nationality,
                        VisaStatus = user.VisaStatus,
                        VisaExpiryDate = user.VisaExpiryDate,
                        ProfilePhoto = user.ProfilePhoto,
                        ProfilePhotoUrl = user.ProfilePhotoUrl,
                        Summary = user.Summary,
                        Description = user.Description,
                        LinkedAccounts = user.LinkedAccounts,
                        JobSeekingStatus = user.JobSeekingStatus,
                        Languages = langs,
                        Skills = skills,
                        Experience = experiences
                    };
                    return result;
                }

                return null;
            }

            public async Task<bool> UpdateTalentProfile(TalentProfileViewModel user, string updaterId)
            {
            Console.WriteLine("updating profile");
                try
                {
                    if (user.Id != null)
                    {
                   
                        User existingUser = (await _userRepository.GetByIdAsync(user.Id));
                        existingUser.FirstName = user.FirstName;
                    existingUser.LastName = user.LastName;
                    existingUser.Email = user.Email;
                    existingUser.Phone = user.Phone;
                    existingUser.LinkedAccounts = user.LinkedAccounts;
                    existingUser.Nationality = user.Nationality;
                    existingUser.Summary = user.Summary;
                    existingUser.Description = user.Description;
                    existingUser.JobSeekingStatus = user.JobSeekingStatus;
                    existingUser.ProfilePhoto = user.ProfilePhoto;
                    existingUser.ProfilePhotoUrl = user.ProfilePhotoUrl;
                    existingUser.Address = user.Address;
                    existingUser.VisaExpiryDate = user.VisaExpiryDate;
                    existingUser.VisaStatus = user.VisaStatus;
                  
                     List<UserLanguage> list = new List<UserLanguage>();
                    foreach (var lang in user.Languages)
                    {
                        
                        list.Add(new UserLanguage {
                            Language = lang.Name,
                            LanguageLevel = lang.Level
                        }); 
                    }
                    existingUser.Languages = list;

                    List<UserSkill> skillList = new List<UserSkill>();
                    foreach(var skill in user.Skills)
                    {

                        skillList.Add(
                            new UserSkill
                            {
                                Skill = skill.Name,
                                ExperienceLevel = skill.Level
                            }
                            );
                    }
                    existingUser.Skills = skillList;


                    List<UserExperience> experienceList = new List<UserExperience>();
                    foreach(var exp in user.Experience)
                    {
                        Console.WriteLine(" start date" + exp.Start);
                        Console.WriteLine(" ene data" + exp.End);
                        UserExperience userExper = new UserExperience
                        {
                            Id = exp.Id,
                            Company = exp.Company,
                            Position = exp.Position,
                            Responsibilities = exp.Responsibilities,
                            Start = exp.Start,
                            End = exp.End
                        };
                        Console.WriteLine("id" + userExper.Id);
                        experienceList.Add(userExper);
                    }

                    existingUser.Experience = experienceList;

                    Console.WriteLine("beofre update");
                        await _userRepository.Update(existingUser);
                   
                        return true;
                    }
                    return false;
                }
                catch (MongoException e)
                {
                    return false;
                }
            }

            public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
            {

                Employer profile = null;
                switch (role)
                {
                    case "employer":
                        profile = (await _employerRepository.GetByIdAsync(Id));
                        break;
                    case "recruiter":
                        profile = (await _recruiterRepository.GetByIdAsync(Id));
                        break;
                }

                var videoUrl = "";

                if (profile != null)
                {
                    videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                              ? ""
                              : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                    var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                    var result = new EmployerProfileViewModel
                    {
                        Id = profile.Id,
                        CompanyContact = profile.CompanyContact,
                        PrimaryContact = profile.PrimaryContact,
                        Skills = skills,
                        ProfilePhoto = profile.ProfilePhoto,
                        ProfilePhotoUrl = profile.ProfilePhotoUrl,
                        VideoName = profile.VideoName,
                        VideoUrl = videoUrl,
                        DisplayProfile = profile.DisplayProfile,
                    };
                    return result;
                }

                return null;
            }

            public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
            {
                try
                {
                    if (employer.Id != null)
                    {
                        switch (role)
                        {
                            case "employer":
                                Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                                existingEmployer.CompanyContact = employer.CompanyContact;
                                existingEmployer.PrimaryContact = employer.PrimaryContact;
                                existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                                existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                                existingEmployer.DisplayProfile = employer.DisplayProfile;
                                existingEmployer.UpdatedBy = updaterId;
                                existingEmployer.UpdatedOn = DateTime.Now;

                                var newSkills = new List<UserSkill>();
                                foreach (var item in employer.Skills)
                                {
                                    var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                    if (skill == null)
                                    {
                                        skill = new UserSkill
                                        {
                                            Id = ObjectId.GenerateNewId().ToString(),
                                            IsDeleted = false
                                        };
                                    }
                                    UpdateSkillFromView(item, skill);
                                    newSkills.Add(skill);
                                }
                                existingEmployer.Skills = newSkills;

                                await _employerRepository.Update(existingEmployer);
                                break;

                            case "recruiter":
                                Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                                existingRecruiter.CompanyContact = employer.CompanyContact;
                                existingRecruiter.PrimaryContact = employer.PrimaryContact;
                                existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                                existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                                existingRecruiter.DisplayProfile = employer.DisplayProfile;
                                existingRecruiter.UpdatedBy = updaterId;
                                existingRecruiter.UpdatedOn = DateTime.Now;

                                var newRSkills = new List<UserSkill>();
                                foreach (var item in employer.Skills)
                                {
                                    var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                    if (skill == null)
                                    {
                                        skill = new UserSkill
                                        {
                                            Id = ObjectId.GenerateNewId().ToString(),
                                            IsDeleted = false
                                        };
                                    }
                                    UpdateSkillFromView(item, skill);
                                    newRSkills.Add(skill);
                                }
                                existingRecruiter.Skills = newRSkills;
                                await _recruiterRepository.Update(existingRecruiter);

                                break;
                        }
                        return true;
                    }
                    return false;
                }
                catch (MongoException e)
                {
                    return false;
                }
            }

            public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
            {
                var fileExtension = Path.GetExtension(file.FileName);
                List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

                if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
                {
                    return false;
                }

                var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

                if (profile == null)
                {
                    return false;
                }

                var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

                if (!string.IsNullOrWhiteSpace(newFileName))
                {
                    var oldFileName = profile.ProfilePhoto;

                    if (!string.IsNullOrWhiteSpace(oldFileName))
                    {
                        await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                    }

                    profile.ProfilePhoto = newFileName;
                    profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                    await _employerRepository.Update(profile);
                    return true;
                }

                return false;

            }

            public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
            {
                //Your code here;
                throw new NotImplementedException();

            }

            public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            #region TalentMatching

            public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            #endregion

            #region Conversion Methods

            #region Update from View

            protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
            {
                original.ExperienceLevel = model.Level;
                original.Skill = model.Name;
            }

            #endregion

            #region Build Views from Model

            protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
            {
                return new AddSkillViewModel
                {
                    Id = skill.Id,
                    Level = skill.ExperienceLevel,
                    Name = skill.Skill
                };
            }

            #endregion

            #endregion

            #region ManageClients

            public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
            {
                //Your code here;
                throw new NotImplementedException();
            }

            public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
            {
                //Your code here;
                throw new NotImplementedException();
            }
         
            public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
            {
                //Your code here;
                throw new NotImplementedException();

            }

            public async Task<Employer> GetEmployer(string employerId)
            {
                return await _employerRepository.GetByIdAsync(employerId);
            }
            #endregion

        }
    }
